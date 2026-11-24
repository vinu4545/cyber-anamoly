import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Download, FileUp, Loader2, Play, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, type Detail, type Rec, type Summary, type Upload } from "../api";
import Counter from "../components/Counter";

const STAGE_NAMES: Record<string, string> = { validate: "Validating network records", preprocess: "Processing network features", isolation_forest: "Running Isolation Forest" };
const PCTS = [90, 95, 97, 99];

export default function TrafficAnalyzer() {
  const [up, setUp] = useState<Upload | null>(null), [sum, setSum] = useState<Summary | null>(null);
  const [pct, setPct] = useState(95), [busy, setBusy] = useState<"" | "upload" | "detect">(""), [err, setErr] = useState(""), [drag, setDrag] = useState(false);
  const [recs, setRecs] = useState<Rec[]>([]), [total, setTotal] = useState(0), [page, setPage] = useState(1), [status, setStatus] = useState("anomalous"), [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Detail | null>(null);

  const onFile = async (f?: File) => {
    if (!f) return; setErr(""); setSum(null); setUp(null); setBusy("upload");
    try { setUp(await api.upload(f)); } catch (e) { setErr((e as Error).message); } finally { setBusy(""); }
  };
  const run = async () => {
    if (!up) return; setErr(""); setSum(null); setBusy("detect");
    try { const s = await api.detect(up.upload_id, pct, up.file); setSum(s); setPage(1); setStatus("anomalous"); } catch (e) { setErr((e as Error).message); } finally { setBusy(""); }
  };
  const load = useCallback(async () => {
    if (!sum) return;
    const q = new URLSearchParams({ page: String(page), page_size: "12", status, search });
    try { const r = await api.records(sum.session_id, q); setRecs(r.records); setTotal(r.total); } catch (e) { setErr((e as Error).message); }
  }, [sum, page, status, search]);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}
          className={`rounded-xl border-2 border-dashed p-8 text-center transition ${drag ? "border-cy bg-cy/10" : "border-line"}`}>
          {busy === "upload" ? <Loader2 className="mx-auto animate-spin text-cy" /> : <FileUp className="mx-auto text-cy" />}
          <p className="mt-2 font-display">Drop a network-flow CSV here</p><p className="text-xs text-mut">CIC-IDS2017 format · up to 200,000 rows</p>
          <label className="inline-block mt-3 px-4 py-2 rounded-lg border border-line cursor-pointer hover:border-cy text-sm">Choose file<input type="file" accept=".csv" hidden onChange={(e) => onFile(e.target.files?.[0])} /></label>
        </div>
        {err && <div className="mt-3 flex gap-2 items-start text-crit text-sm"><AlertTriangle size={16} className="mt-0.5" />{err}</div>}
      </div>

      <AnimatePresence>{up && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-5 space-y-4">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <Fact k="File" v={up.file} /><Fact k="Size" v={`${(up.size_bytes / 1024).toFixed(0)} KB`} /><Fact k="Records" v={up.rows.toLocaleString()} /><Fact k="Columns" v={String(up.columns)} />
            <Fact k="Missing" v={String(up.missing_values)} /><Fact k="Infinite" v={String(up.infinite_values)} /><Fact k="Duplicates" v={String(up.duplicate_rows)} />
            <span className={`flex items-center gap-1 ${up.compatible ? "text-ok" : "text-crit"}`}>{up.compatible ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}{up.compatible ? "Compatible with the model" : `Missing ${up.missing_model_features.length} model features`}</span>
          </div>
          {up.label_counts && <div className="text-xs text-mut mono">Label column found (used for evaluation only, never as a feature): {Object.entries(up.label_counts).map(([k, v]) => `${k} ${v}`).join(" · ")}</div>}
          <div className="overflow-x-auto"><table className="text-xs mono w-full"><thead className="text-mut"><tr>{Object.keys(up.preview[0] || {}).slice(0, 7).map((c) => <th key={c} className="text-left pr-4 py-1 whitespace-nowrap">{c}</th>)}</tr></thead>
            <tbody>{up.preview.slice(0, 5).map((r, i) => <tr key={i} className="border-t border-line">{Object.values(r).slice(0, 7).map((v, j) => <td key={j} className="pr-4 py-1 whitespace-nowrap">{String(v)}</td>)}</tr>)}</tbody></table></div>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="text-sm text-mut">Alert line: flag flows above the <select value={pct} onChange={(e) => setPct(+e.target.value)} className="bg-elev border border-line rounded px-2 py-1 text-tx">{PCTS.map((p) => <option key={p} value={p}>{p}th</option>)}</select> percentile of normal traffic</div>
            <button disabled={!up.compatible || busy === "detect"} onClick={run} className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-lg font-display font-bold text-bg bg-gradient-to-r from-cy to-vi disabled:opacity-40 hover:shadow-[0_0_24px_rgba(0,213,255,.45)] transition">
              {busy === "detect" ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}INITIATE ANOMALY DETECTION</button>
          </div>
          {busy === "detect" && <div className="text-sm text-cy animate-pulse">Initializing detection engine · validating, preprocessing and scoring on the backend…</div>}
        </motion.div>)}</AnimatePresence>

      {sum && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
        <div className="card p-4 flex flex-wrap gap-6 items-center text-sm">
          {sum.stages.map((s, i) => <motion.div key={s.stage} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.25 }} className="flex items-center gap-2"><CheckCircle2 size={15} className="text-ok" />{STAGE_NAMES[s.stage] ?? s.stage}<span className="mono text-mut">{s.seconds}s</span></motion.div>)}
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <Kpi l="Records analysed" n={sum.records_analysed} /><Kpi l="Normal" n={sum.normal} c="text-ok" /><Kpi l="Anomalous" n={sum.anomalous} c="text-crit" /><Kpi l="Anomaly rate" n={sum.anomaly_pct} dec={2} s="%" /><Kpi l="Processing time" n={sum.processing_seconds} dec={3} s=" s" />
        </div>
        {sum.skipped_invalid_rows > 0 && <div className="text-xs text-warn">{sum.skipped_invalid_rows} rows with missing or infinite values were skipped.</div>}
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-5"><div className="font-display mb-2">Anomaly score distribution</div>
            <ResponsiveContainer width="100%" height={240}><BarChart data={sum.score_distribution.map((d) => ({ ...d, x: d.from.toFixed(2) }))}><CartesianGrid stroke="#223149" vertical={false} /><XAxis dataKey="x" tick={{ fill: "#8795A9", fontSize: 10 }} /><YAxis tick={{ fill: "#8795A9", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#172334", border: "1px solid #223149" }} /><Bar dataKey="normal" stackId="a" fill="#7967FF" name="Normal" isAnimationActive /><Bar dataKey="flagged" stackId="a" fill="#FF4567" name="Flagged" /></BarChart></ResponsiveContainer>
            <div className="text-xs text-mut mono">alert line at score {sum.threshold.toFixed(4)}</div></div>
          <div className="card p-5"><div className="font-display mb-2">Evaluation against ground truth</div>
            {sum.evaluation ? <div className="grid grid-cols-3 gap-3 text-sm">{(["precision", "recall", "f1", "false_positive_rate", "pr_auc", "roc_auc"] as const).map((k) => <div key={k}><div className="text-mut text-xs">{k.replace(/_/g, " ")}</div><div className="mono text-lg">{sum.evaluation![k].toFixed(3)}</div></div>)}
              <div className="col-span-3 text-xs text-mut mono">Recall by label: {Object.entries(sum.evaluation.recall_by_label).map(([k, v]) => `${k} ${(v * 100).toFixed(0)}%`).join(" · ")}</div></div>
              : <p className="text-sm text-mut">No Label column in this file, so no evaluation and no attack categories are claimed.</p>}</div>
        </div>

        <div className="card p-5">
          <div className="flex flex-wrap gap-3 items-center mb-3"><div className="font-display mr-auto">Detection results</div>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="bg-elev border border-line rounded px-2 py-1 text-sm"><option value="anomalous">Anomalous</option><option value="normal">Normal</option><option value="all">All</option></select>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search IP or record ID" className="bg-elev border border-line rounded px-3 py-1 text-sm" />
            <a href={`/api/analysis/${sum.session_id}/export.csv`} className="flex items-center gap-1 text-sm text-cy hover:underline"><Download size={15} />Export CSV</a></div>
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-mut text-left"><tr><th className="py-2">Record</th><th>Source IP*</th><th>Destination IP*</th><th>Proto*</th><th>Score</th><th>Prediction</th>{sum.evaluation && <th>Ground truth</th>}</tr></thead>
            <tbody>{recs.map((r) => <tr key={r.record_id} onClick={() => api.detail(sum.session_id, r.record_id).then(setDetail)} className="border-t border-line cursor-pointer hover:bg-elev/60">
              <td className="py-2 mono">#{r.record_id}</td><td className="mono">{r.source_ip}</td><td className="mono">{r.destination_ip}</td><td>{r.protocol}</td><td className="mono">{r.anomaly_score.toFixed(3)}</td>
              <td><span className={`px-2 py-0.5 rounded-full text-xs border ${r.prediction === "ANOMALOUS" ? "text-crit border-crit" : "text-mut border-line"}`}>{r.prediction}</span></td>{sum.evaluation && <td className="text-xs text-mut">{r.actual_label}</td>}</tr>)}</tbody></table>
            {recs.length === 0 && <p className="text-sm text-mut py-6 text-center">No records match this filter.</p>}</div>
          <div className="flex items-center justify-between mt-3 text-xs text-mut"><span>* simulated demo values, not part of the model input</span>
            <span className="flex items-center gap-3"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="disabled:opacity-30 hover:text-cy">Prev</button>{page} / {Math.max(1, Math.ceil(total / 12))}<button disabled={page * 12 >= total} onClick={() => setPage(page + 1)} className="disabled:opacity-30 hover:text-cy">Next</button></span></div>
        </div>
      </motion.div>)}

      <AnimatePresence>{detail && (
        <motion.aside initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} className="fixed right-0 top-0 h-screen w-[400px] max-w-full bg-bg2 border-l border-line z-30 p-5 overflow-y-auto">
          <button onClick={() => setDetail(null)} className="absolute right-4 top-4 text-mut hover:text-cy"><X /></button>
          <div className="font-display text-lg">Record #{detail.record_id}</div>
          <div className={`mt-1 text-sm ${detail.prediction === "ANOMALOUS" ? "text-crit" : "text-ok"}`}>{detail.prediction} · score {detail.anomaly_score.toFixed(4)}</div>
          <div className="mono text-xs text-mut mt-2">{detail.source_ip} → {detail.destination_ip} · {detail.protocol} (simulated)</div>
          {detail.actual_label && <div className="text-xs mt-1">Ground truth: <b>{detail.actual_label}</b></div>}
          <div className="font-display mt-5 mb-2">Most unusual features</div>
          {detail.deviations.map((d) => <div key={d.feature} className="mb-3"><div className="flex justify-between text-sm"><span>{d.feature}</span><span className="mono text-xs text-mut">{d.z_score > 0 ? "+" : ""}{d.z_score} σ</span></div>
            <div className="h-1.5 rounded bg-line"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.abs(d.z_score) * 12)}%` }} className={`h-full rounded ${d.z_score > 0 ? "bg-crit" : "bg-cy"}`} /></div>
            <div className="mono text-[11px] text-mut mt-0.5">value {d.value.toLocaleString()} · typical normal ≈ {d.typical_normal.toFixed(2)}</div></div>)}
          <p className="text-xs text-mut mt-4 border-l-2 border-warn pl-3">{detail.note}</p>
        </motion.aside>)}</AnimatePresence>
    </div>
  );
}
const Fact = ({ k, v }: { k: string; v: string }) => <div><span className="text-mut">{k}: </span><span className="mono">{v}</span></div>;
const Kpi = ({ l, n, dec, s, c }: { l: string; n: number; dec?: number; s?: string; c?: string }) => <div className="card p-4"><div className={`text-2xl font-display font-bold ${c ?? "text-cy"}`}><Counter to={n} dec={dec} suffix={s} /></div><div className="text-xs text-mut">{l}</div></div>;
