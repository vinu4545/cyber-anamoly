# SENTINEL AI backend (Stage 1)

FastAPI service that runs your **real, saved Isolation Forest**. No simulated detection logic.

## Setup (Ubuntu)
1. `python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`
   In your notebook run `import sklearn; print(sklearn.__version__)` and install that exact version, or the model may not load.
2. Copy these files into `model/`:
   - `artifacts/iforest.joblib`, `artifacts/scaler.joblib` (from Cell 29)
   - `export/config.json`, `export/metrics.json` (from Cell 28)
3. Run: `uvicorn app.main:app --reload --port 8000`
4. Open http://localhost:8000/docs to try every endpoint.

## Endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | /api/health | status, model loaded |
| POST | /api/dataset/upload | upload CSV; returns rows, columns, dtypes, missing, duplicates, preview, label counts, compatibility |
| POST | /api/model/detect | `{upload_id, threshold_percentile: 90/95/97/99}`; validate, preprocess, score; real stage timings, summary, evaluation if labels exist |
| GET | /api/model/metrics | your saved test results (404 if metrics.json missing; nothing is invented) |
| GET | /api/analysis/history | past sessions (SQLite) |
| GET | /api/analysis/{sid} | reopen a session summary |
| GET | /api/analysis/{sid}/records | paged table: `page, page_size, status, search, sort` |
| GET | /api/analysis/{sid}/records/{rid} | one record + top feature deviations |
| GET | /api/analysis/{sid}/export.csv | results as CSV |
| GET | /api/investigations | one item per flagged record |
| PATCH | /api/investigations/{id} | status: New, Under Investigation, Resolved, False Positive |

## Rules this code follows
- `Label` is never a model input; it is kept aside for evaluation only. Unlabelled files work and make no attack-type claims.
- Same preprocessing as training: 61 features, signed log1p, saved StandardScaler. Missing features give a 422 naming them. Rows with missing or infinite values are skipped and counted.
- **Simulated fields:** source IP, destination IP, protocol and timestamp are generated (seeded per session, independent of labels). Responses list them in `simulated_fields`; the CSV export marks them `_simulated`. The frontend must show them as demo data.
- **Severity (High / Medium / Low)** is a triage policy by score band (above the 99th, 97th and 95th percentile of normal traffic), NOT attack severity. Our band analysis showed the very highest scores can be harmless giant flows, so treat it as a review order only.
- Deviation values are contextual indicators, not an exact explanation of the model.
- Limits: 200,000 rows per upload. One-Class SVM and DBSCAN are offline experiments, so their results come from `metrics.json`, not live inference.
