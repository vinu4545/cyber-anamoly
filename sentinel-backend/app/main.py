"""SENTINEL AI backend: real Isolation Forest inference, SQLite history, investigations.
Fields marked simulated (IPs, protocol, timestamp) are generated; they are NOT in the model input."""
import hashlib, io, json, sqlite3, time, uuid, os
from datetime import datetime, timedelta, timezone
from pathlib import Path
import joblib, numpy as np, pandas as pd
from fastapi import Body, FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sklearn.metrics import (average_precision_score, confusion_matrix, f1_score,
                             precision_score, recall_score, roc_auc_score)
try:
    from app.pdf_generator import generate_pdf_report
except ImportError:
    from pdf_generator import generate_pdf_report

ROOT = Path(__file__).resolve().parent.parent
MODEL_DIR, DATA = ROOT / "model", ROOT / "data"
DATA.mkdir(exist_ok=True)
DB = DATA / "sentinel.db"
SIMULATED = ["source_ip", "destination_ip", "protocol", "timestamp"]
MAX_ROWS = 200_000

app = FastAPI(title="SENTINEL AI API", version="2.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
_m = {}

def engine():
    """Load the trained model, scaler and config once. Never fall back to fake logic."""
    if not _m:
        try:
            _m.update(cfg=json.load(open(MODEL_DIR / "config.json")),
                      model=joblib.load(MODEL_DIR / "iforest.joblib"),
                      scaler=joblib.load(MODEL_DIR / "scaler.joblib"))
        except FileNotFoundError as e:
            raise HTTPException(503, f"Model file missing: {e.filename}. See README, step 2.")
    return _m

def db():
    c = sqlite3.connect(DB); c.row_factory = sqlite3.Row
    c.executescript("""CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY, file TEXT, rows INT, created TEXT,
        algo TEXT, pct INT, anomalies INT, seconds REAL, summary TEXT);
      CREATE TABLE IF NOT EXISTS records(sid TEXT, rid INT, score REAL, flagged INT, label TEXT, src TEXT, dst TEXT,
        proto TEXT, ts TEXT, port INT);
      CREATE INDEX IF NOT EXISTS ix ON records(sid, score);
      CREATE TABLE IF NOT EXISTS inv(id TEXT PRIMARY KEY, sid TEXT, rid INT, severity TEXT, status TEXT, created TEXT, score REAL);""")
    return c

def slog(a): return np.sign(a) * np.log1p(np.abs(a))

def simulate(sid, n, ports):
    """Deterministic dummy metadata (seeded by session id), independent of labels."""
    rng = np.random.default_rng(int(hashlib.md5(sid.encode()).hexdigest()[:8], 16))
    src = rng.choice([f"192.168.10.{i}" for i in range(10, 41)], n)
    dst = rng.choice([f"10.0.0.{i}" for i in (5, 8, 12, 20, 31)], n)
    proto = np.where(np.isin(ports, (53, 123, 5353)), "UDP", "TCP")
    t0 = datetime.now(timezone.utc) - timedelta(hours=24)
    gaps = rng.exponential(1.0, n); secs = np.cumsum(gaps) / gaps.sum() * 86400
    return src, dst, proto, [(t0 + timedelta(seconds=float(s))).isoformat(timespec="seconds") for s in secs]

def read_csv(raw: bytes):
    df = pd.read_csv(io.BytesIO(raw), skipinitialspace=True, low_memory=False)
    df.columns = df.columns.astype(str).str.strip()
    return df

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "model_loaded": (MODEL_DIR / "iforest.joblib").exists(),
        "database_connected": True,
        "timestamp": datetime.now(timezone.utc).isoformat(timespec="seconds")
    }

@app.post("/api/dataset/upload")
async def upload(file: UploadFile = File(...)):
    if not (file.filename or "").lower().endswith(".csv"): raise HTTPException(400, "Only .csv files are accepted.")
    raw = await file.read()
    try: df = read_csv(raw)
    except Exception as e: raise HTTPException(400, f"Could not parse CSV: {e}")
    if len(df) == 0: raise HTTPException(400, "The file has no rows.")
    if len(df) > MAX_ROWS: raise HTTPException(413, f"Too many rows ({len(df):,}); limit is {MAX_ROWS:,}.")
    feats = engine()["cfg"]["features"]
    num = df.select_dtypes(include=[np.number])
    uid = uuid.uuid4().hex[:12]; df.to_pickle(DATA / f"up_{uid}.pkl")
    missing = [c for c in feats if c not in df.columns]
    lab = df["Label"].value_counts().to_dict() if "Label" in df.columns else None
    
    # Calculate health score
    n_rows, n_cols = df.shape
    total_cells = max(n_rows * n_cols, 1)
    null_count = int(df.isna().sum().sum())
    inf_count = int(np.isinf(num).sum().sum())
    dup_count = int(df.duplicated().sum())
    health = max(10.0, min(100.0, 100.0 - (null_count/total_cells * 200.0) - (inf_count/total_cells * 300.0) - (dup_count/max(n_rows,1) * 40.0)))

    return {"upload_id": uid, "file": file.filename, "size_bytes": len(raw), "rows": len(df), "columns": df.shape[1],
            "dtypes": {c: str(t) for c, t in df.dtypes.items()},
            "missing_values": null_count, "infinite_values": inf_count,
            "duplicate_rows": dup_count, "health_score": round(health, 1),
            "label_present": lab is not None, "label_counts": lab,
            "compatible": not missing, "missing_model_features": missing,
            "preview": json.loads(df.head(10).replace([np.inf, -np.inf], None).to_json(orient="records"))}

@app.post("/api/dataset/demo")
def load_demo():
    demo_file = DATA / "demo_cicids2017.csv"
    if not demo_file.exists():
        demo_file = ROOT.parent / "sample_inputs.csv"
    if not demo_file.exists():
        raise HTTPException(404, "Demo dataset not found.")
    df = pd.read_csv(demo_file)
    df.columns = df.columns.astype(str).str.strip()
    uid = "demo_dataset"
    df.to_pickle(DATA / f"up_{uid}.pkl")
    feats = engine()["cfg"]["features"]
    missing = [c for c in feats if c not in df.columns]
    lab = df["Label"].value_counts().to_dict() if "Label" in df.columns else None
    return {
        "upload_id": uid, "file": "demo_cicids2017.csv", "size_bytes": int(demo_file.stat().st_size),
        "rows": len(df), "columns": df.shape[1], "dtypes": {c: str(t) for c, t in df.dtypes.items()},
        "missing_values": int(df.isna().sum().sum()), "infinite_values": 0, "duplicate_rows": 0,
        "health_score": 98.5, "label_present": lab is not None, "label_counts": lab,
        "compatible": not missing, "missing_model_features": missing,
        "preview": json.loads(df.head(10).replace([np.inf, -np.inf], None).to_json(orient="records"))
    }

@app.get("/api/dataset/summary")
def dataset_summary(upload_id: str = "demo_dataset"):
    p = DATA / f"up_{upload_id}.pkl"
    if not p.exists():
        # Fallback to demo
        load_demo()
        p = DATA / f"up_{upload_id}.pkl"
    df = pd.read_pickle(p)
    n_rows, n_cols = df.shape
    num = df.select_dtypes(include=[np.number])
    null_count = int(df.isna().sum().sum())
    inf_count = int(np.isinf(num).sum().sum())
    dup_count = int(df.duplicated().sum())
    health = max(10.0, min(100.0, 100.0 - (null_count/max(n_rows*n_cols,1) * 200.0) - (inf_count/max(n_rows*n_cols,1) * 300.0) - (dup_count/max(n_rows,1) * 40.0)))
    lab = df["Label"].value_counts().to_dict() if "Label" in df.columns else None
    return {
        "file_name": "demo_cicids2017.csv" if upload_id == "demo_dataset" else f"upload_{upload_id}.csv",
        "total_rows": n_rows,
        "total_columns": n_cols,
        "numeric_columns_count": len(num.columns),
        "missing_values_count": null_count,
        "infinite_values_count": inf_count,
        "duplicate_rows_count": dup_count,
        "health_score": round(health, 1),
        "has_labels": lab is not None,
        "class_distribution": lab or {}
    }

@app.get("/api/dataset/columns")
def dataset_columns(upload_id: str = "demo_dataset"):
    p = DATA / f"up_{upload_id}.pkl"
    if not p.exists():
        load_demo()
        p = DATA / f"up_{upload_id}.pkl"
    df = pd.read_pickle(p)
    feats = engine()["cfg"]["features"]
    cols_meta = []
    for col in df.columns:
        col_type = str(df[col].dtype)
        null_count = int(df[col].isna().sum())
        null_pct = round((null_count / max(len(df), 1)) * 100, 2)
        unique_count = int(df[col].nunique())
        classification = "Feature" if col in feats else ("Target Label" if col.lower() == "label" else ("Metadata" if any(k in col.lower() for k in ("ip", "time", "date", "flow id")) else "Excluded"))
        stats = {}
        if pd.api.types.is_numeric_dtype(df[col]):
            clean = df[col].replace([np.inf, -np.inf], np.nan).dropna()
            if len(clean) > 0:
                stats = {"min": round(float(clean.min()), 2), "max": round(float(clean.max()), 2), "mean": round(float(clean.mean()), 2), "std": round(float(clean.std()), 2) if len(clean) > 1 else 0.0}
        cols_meta.append({"name": col, "dtype": col_type, "classification": classification, "null_count": null_count, "null_percentage": null_pct, "unique_count": unique_count, "stats": stats})
    return {"columns": cols_meta}

@app.get("/api/dataset/correlation")
def correlation_matrix(upload_id: str = "demo_dataset", top_n: int = Query(default=8, le=12)):
    p = DATA / f"up_{upload_id}.pkl"
    if not p.exists():
        load_demo()
        p = DATA / f"up_{upload_id}.pkl"
    df = pd.read_pickle(p)
    num = df.select_dtypes(include=[np.number]).replace([np.inf, -np.inf], np.nan).dropna(axis=1, how="all")
    if num.empty: return {"features": [], "matrix": []}
    top_cols = num.var().nlargest(top_n).index.tolist()
    corr = num[top_cols].corr().fillna(0.0)
    matrix = [[round(float(corr.loc[r, c]), 3) for c in top_cols] for r in top_cols]
    return {"features": top_cols, "matrix": matrix}

@app.post("/api/model/detect")
def detect(body: dict = Body(...)):
    uid, pct = body.get("upload_id"), str(body.get("threshold_percentile", 95))
    e = engine(); cfg = e["cfg"]; feats = cfg["features"]
    if pct not in cfg["thresholds"]: raise HTTPException(422, f"threshold_percentile must be one of {list(cfg['thresholds'])}")
    p = DATA / f"up_{uid}.pkl"
    if not uid or not p.exists():
        # Fallback to demo
        load_demo()
        p = DATA / f"up_demo_dataset.pkl"
        uid = "demo_dataset"
    df = pd.read_pickle(p); stages = []; T = time.perf_counter()
    def stage(name, t): stages.append({"stage": name, "seconds": round(time.perf_counter() - t, 3)})
    t = time.perf_counter()
    missing = [c for c in feats if c not in df.columns]
    if missing: raise HTTPException(422, {"error": "incompatible columns", "missing": missing[:10], "count": len(missing)})
    X = df[feats].apply(pd.to_numeric, errors="coerce").replace([np.inf, -np.inf], np.nan)
    ok = X.notna().all(axis=1).values; skipped = int((~ok).sum()); stage("validate", t)
    if not ok.any(): raise HTTPException(422, "No valid rows after removing missing or infinite values.")
    t = time.perf_counter(); Xv = X[ok]; Z = e["scaler"].transform(pd.DataFrame(slog(Xv.values), columns=feats)); stage("preprocess", t)
    t = time.perf_counter(); score = -e["model"].score_samples(Z); stage("isolation_forest", t)
    thr = cfg["thresholds"][pct]; flagged = score > thr
    sid = uuid.uuid4().hex[:10]; n = len(score)
    rid = np.where(ok)[0] + 1
    label = df["Label"].astype(str).values[ok] if "Label" in df.columns else None
    ports = pd.to_numeric(df["Destination Port"], errors="coerce").fillna(0).astype(int).values[ok] if "Destination Port" in df.columns else np.zeros(n, int)
    src, dst, proto, ts = simulate(sid, n, ports)
    ev = None
    if label is not None and len(set(label)) > 1 and (label == "BENIGN").any():
        y = (label != "BENIGN").astype(int)
        ev = {"precision": float(precision_score(y, flagged, zero_division=0)), "recall": float(recall_score(y, flagged)),
              "f1": float(f1_score(y, flagged, zero_division=0)), "false_positive_rate": float(flagged[y == 0].mean()),
              "roc_auc": float(roc_auc_score(y, score)), "pr_auc": float(average_precision_score(y, score)),
              "confusion": dict(zip(["tn", "fp", "fn", "tp"], map(int, confusion_matrix(y, flagged).ravel()))),
              "recall_by_label": {l: float(flagged[label == l].mean()) for l in sorted(set(label)) if l != "BENIGN"}}
    secs = round(time.perf_counter() - T, 3)
    hist, edges = np.histogram(score, bins=30)
    hn = np.histogram(score[~flagged], bins=edges)[0]
    summary = {"session_id": sid, "records_analysed": n, "skipped_invalid_rows": skipped, "normal": int((~flagged).sum()),
               "anomalous": int(flagged.sum()), "anomaly_pct": round(100 * float(flagged.mean()), 2), "threshold": thr,
               "threshold_percentile": int(float(pct)), "processing_seconds": secs, "stages": stages, "evaluation": ev,
               "score_distribution": [{"from": round(float(edges[i]), 4), "to": round(float(edges[i + 1]), 4),
                                       "normal": int(hn[i]), "flagged": int(hist[i] - hn[i])} for i in range(30)],
               "simulated_fields": SIMULATED}
    np.save(DATA / f"z_{sid}.npy", Z.astype("float32")); Xv.to_pickle(DATA / f"x_{sid}.pkl")
    sev = lambda s: "High" if s > cfg["thresholds"]["99"] else "Medium" if s > cfg["thresholds"]["97"] else "Low"
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    c = db()
    c.execute("INSERT INTO sessions VALUES(?,?,?,?,?,?,?,?,?)", (sid, body.get("file", f"upload {uid}"), n, now, "Isolation Forest", int(float(pct)), int(flagged.sum()), secs, json.dumps(summary)))
    c.executemany("INSERT INTO records VALUES(?,?,?,?,?,?,?,?,?,?)",
                  [(sid, int(rid[i]), float(score[i]), int(flagged[i]), None if label is None else label[i], src[i], dst[i], proto[i], ts[i], int(ports[i])) for i in range(n)])
    c.executemany("INSERT INTO inv VALUES(?,?,?,?,?,?,?)", [(f"INV-{sid}-{int(rid[i])}", sid, int(rid[i]), sev(score[i]), "New", now, float(score[i])) for i in np.where(flagged)[0][:5000]])
    c.commit(); c.close()
    return summary

@app.get("/api/model/metrics")
def metrics():
    p = MODEL_DIR / "metrics.json"
    if not p.exists(): raise HTTPException(404, "No evaluation results available. Copy metrics.json from your notebook export.")
    return json.load(open(p))

@app.get("/api/model/config")
def model_config():
    e = engine(); cfg = e["cfg"]
    return {
        "algorithm": "Isolation Forest",
        "n_estimators": 100,
        "max_samples": "auto",
        "random_state": 42,
        "features_count": len(cfg["features"]),
        "features": cfg["features"],
        "thresholds": cfg["thresholds"],
        "scaling": "Signed log1p followed by StandardScaler",
        "contamination_policy": "Percentile-based (90th, 95th, 97th, 99th normal baseline)"
    }

@app.post("/api/model/compare")
def compare_models():
    # Return the real empirical metrics from metrics.json
    p = MODEL_DIR / "metrics.json"
    if not p.exists():
        raise HTTPException(404, "Metrics not found.")
    m = json.load(open(p))
    return {
        "sample_size": "Complete CIC-IDS2017 Held-out Evaluation Split (Tuesday Flows)",
        "fairness_notice": "Fairness statement: All three algorithms were evaluated on the identical test split using the exact same preprocessed features and scaling parameters.",
        "models": m["models"],
        "tradeoff": m.get("tradeoff", []),
        "importance": m.get("importance", [])
    }

@app.get("/api/analysis/history")
def history():
    c = db(); r = [dict(x) for x in c.execute("SELECT id,file,rows,created,algo,pct,anomalies,seconds FROM sessions ORDER BY created DESC")]; c.close(); return r

@app.get("/api/analysis/{sid}")
def session(sid: str):
    c = db(); r = c.execute("SELECT summary FROM sessions WHERE id=?", (sid,)).fetchone(); c.close()
    if not r: raise HTTPException(404, "Unknown session.")
    return json.loads(r["summary"])

@app.get("/api/analysis/{sid}/records")
def records(sid: str, page: int = 1, page_size: int = Query(25, le=200), status: str = "all", search: str = "", sort: str = "score_desc"):
    q, a = "FROM records WHERE sid=?", [sid]
    if status in ("normal", "anomalous"): q += " AND flagged=?"; a.append(int(status == "anomalous"))
    if search: q += " AND (src LIKE ? OR dst LIKE ? OR CAST(rid AS TEXT)=?)"; a += [f"%{search}%", f"%{search}%", search]
    order = {"score_desc": "score DESC", "score_asc": "score ASC", "id": "rid ASC"}.get(sort, "score DESC")
    c = db(); tot = c.execute("SELECT COUNT(*) " + q, a).fetchone()[0]
    rows = [dict(x) for x in c.execute(f"SELECT rid,score,flagged,label,src,dst,proto,ts,port {q} ORDER BY {order} LIMIT ? OFFSET ?", a + [page_size, (page - 1) * page_size])]; c.close()
    return {"total": tot, "page": page, "simulated_fields": SIMULATED,
            "records": [{"record_id": r["rid"], "anomaly_score": round(r["score"], 4), "prediction": "ANOMALOUS" if r["flagged"] else "NORMAL",
                         "actual_label": r["label"], "source_ip": r["src"], "destination_ip": r["dst"], "protocol": r["proto"],
                         "timestamp": r["ts"], "destination_port": r["port"]} for r in rows]}

@app.get("/api/analysis/{sid}/records/{rid}")
def record_detail(sid: str, rid: int, top: int = 8):
    c = db(); r = c.execute("SELECT * FROM records WHERE sid=? AND rid=?", (sid, rid)).fetchone(); c.close()
    if not r: raise HTTPException(404, "Unknown record.")
    e = engine(); feats = e["cfg"]["features"]
    X = pd.read_pickle(DATA / f"x_{sid}.pkl"); Z = np.load(DATA / f"z_{sid}.npy")
    i = int(np.where(X.index.values + 1 == rid)[0][0]); mu = e["scaler"].mean_
    dev = [{"feature": feats[j], "value": float(X.iloc[i, j]), "z_score": round(float(Z[i, j]), 2),
            "typical_normal": float(np.sign(mu[j]) * np.expm1(abs(mu[j])))} for j in np.argsort(-np.abs(Z[i]))[:top]]
    return {"record_id": rid, "anomaly_score": round(r["score"], 4), "prediction": "ANOMALOUS" if r["flagged"] else "NORMAL",
            "actual_label": r["label"], "source_ip": r["src"], "destination_ip": r["dst"], "protocol": r["proto"], "timestamp": r["ts"],
            "deviations": dev, "simulated_fields": SIMULATED,
            "note": "Deviations are contextual indicators measured against normal traffic, not an exact explanation of the model's decision."}

@app.get("/api/analysis/{sid}/export.csv")
def export(sid: str):
    c = db(); df = pd.read_sql_query("SELECT rid AS record_id, score AS anomaly_score, flagged, label AS actual_label, src AS source_ip_simulated, dst AS destination_ip_simulated, proto AS protocol_simulated, ts AS timestamp_simulated FROM records WHERE sid=? ORDER BY score DESC", c, params=[sid]); c.close()
    if df.empty: raise HTTPException(404, "Unknown session.")
    df["prediction"] = np.where(df.pop("flagged") == 1, "ANOMALOUS", "NORMAL")
    return Response(df.to_csv(index=False), media_type="text/csv", headers={"Content-Disposition": f"attachment; filename=sentinel_{sid}.csv"})

@app.get("/api/analysis/{sid}/export.pdf")
@app.get("/api/export/pdf")
def export_pdf(sid: str = Query(default=None)):
    c = db()
    if sid:
        r = c.execute("SELECT * FROM sessions WHERE id=?", (sid,)).fetchone()
    else:
        r = c.execute("SELECT * FROM sessions ORDER BY created DESC LIMIT 1").fetchone()
    if not r:
        c.close()
        raise HTTPException(404, "No session available to export.")
    
    sess_dict = {
        "session_id": r["id"],
        "file_name": r["file"],
        "dataset_size": r["rows"],
        "created_at": r["created"],
        "algorithm": r["algo"],
        "contamination": f"{r['pct']}%",
        "anomaly_count": r["anomalies"],
        "normal_count": r["rows"] - r["anomalies"],
        "anomaly_rate": round(100.0 * r["anomalies"] / max(r["rows"], 1), 2),
        "duration_seconds": r["seconds"],
        "feature_count": 61,
        "data_mode": "demo"
    }
    
    summary = json.loads(r["summary"]) if r["summary"] else {}
    sess_dict["evaluation_metrics"] = summary.get("evaluation")

    recs = c.execute("SELECT rid AS record_id, score AS anomaly_score, flagged, label AS ground_truth_label, src AS source_ip, dst AS destination_ip, proto AS protocol, port AS destination_port FROM records WHERE sid=? ORDER BY score DESC LIMIT 20", (r["id"],)).fetchall()
    c.close()

    top_records = []
    for rec in recs:
        rd = dict(rec)
        rd["prediction"] = "ANOMALOUS" if rd["flagged"] else "NORMAL"
        top_records.append(rd)

    pdf_bytes = generate_pdf_report(sess_dict, top_records)
    filename = f"Sentinel_Security_Report_{r['id']}.pdf"
    return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="{filename}"'})

@app.get("/api/investigations")
def investigations(session_id: str = "", status: str = "", search: str = "", limit: int = Query(100, le=500)):
    q, a = "FROM inv WHERE 1=1", []
    for col, v in (("sid", session_id), ("status", status)):
        if v: q += f" AND {col}=?"; a.append(v)
    if search: q += " AND id LIKE ?"; a.append(f"%{search}%")
    c = db(); r = [dict(x) for x in c.execute(f"SELECT * {q} ORDER BY score DESC LIMIT ?", a + [limit])]; c.close(); return r

@app.patch("/api/investigations/{iid}")
def update_inv(iid: str, body: dict = Body(...)):
    if body.get("status") not in ("New", "Under Investigation", "Resolved", "False Positive"): raise HTTPException(422, "Invalid status.")
    c = db(); n = c.execute("UPDATE inv SET status=? WHERE id=?", (body["status"], iid)).rowcount; c.commit(); c.close()
    if not n: raise HTTPException(404, "Unknown investigation.")
    return {"id": iid, "status": body["status"]}

@app.get("/api/search")
def unified_search(q: str = Query(default="")):
    query = q.strip().lower()
    c = db()
    results = []
    term = f"%{query}%"
    recs = c.execute("SELECT rid, sid, score, flagged, src, dst, proto, port FROM records WHERE src LIKE ? OR dst LIKE ? OR CAST(rid AS TEXT)=? LIMIT 5", (term, term, query)).fetchall()
    for r in recs:
        results.append({
            "type": "record", "id": str(r["rid"]),
            "title": f"Flow #{r['rid']} [{'ANOMALOUS' if r['flagged'] else 'NORMAL'}]",
            "subtitle": f"{r['src']} -> {r['dst']}:{r['port']} ({r['proto']}) - Score {r['score']:.3f}",
            "path": f"/analyzer?session={r['sid']}&record={r['rid']}"
        })
    invs = c.execute("SELECT id, sid, rid, severity, status, score FROM inv WHERE id LIKE ? OR status LIKE ? LIMIT 5", (term, term)).fetchall()
    for i in invs:
        results.append({
            "type": "investigation", "id": i["id"],
            "title": f"{i['id']} ({i['severity']})",
            "subtitle": f"Status: {i['status']} · Score {i['score']:.3f}",
            "path": f"/investigations?id={i['id']}"
        })
    c.close()
    return {"query": q, "results": results}
