import { apiUrl } from "./lib/apiConfig";

async function j<T>(r: Response): Promise<T> {
  if (!r.ok) { const e = await r.json().catch(() => ({})); const d = e.detail; throw new Error(typeof d === "string" ? d : d?.error ? `${d.error}: ${(d.missing || []).join(", ")}` : `Request failed (${r.status})`); }
  return r.json();
}
export type Upload = { upload_id: string; file: string; size_bytes: number; rows: number; columns: number; dtypes: Record<string, string>; missing_values: number; infinite_values: number; duplicate_rows: number; label_present: boolean; label_counts: Record<string, number> | null; compatible: boolean; missing_model_features: string[]; preview: Record<string, unknown>[] };
export type Summary = { session_id: string; records_analysed: number; skipped_invalid_rows: number; normal: number; anomalous: number; anomaly_pct: number; threshold: number; threshold_percentile: number; processing_seconds: number; stages: { stage: string; seconds: number }[]; evaluation: null | { precision: number; recall: number; f1: number; false_positive_rate: number; roc_auc: number; pr_auc: number; confusion: Record<string, number>; recall_by_label: Record<string, number> }; score_distribution: { from: number; to: number; normal: number; flagged: number }[] };
export type Rec = { record_id: number; anomaly_score: number; prediction: "NORMAL" | "ANOMALOUS"; actual_label: string | null; source_ip: string; destination_ip: string; protocol: string; timestamp: string };
export type Detail = Rec & { deviations: { feature: string; value: number; z_score: number; typical_normal: number }[]; note: string };
export const api = {
  health: () => fetch(apiUrl("/api/health")).then(j<{ status: string; model_loaded: boolean }>),
  upload: (f: File) => { const fd = new FormData(); fd.append("file", f); return fetch(apiUrl("/api/dataset/upload"), { method: "POST", body: fd }).then(j<Upload>); },
  detect: (upload_id: string, threshold_percentile: number, file: string) => fetch(apiUrl("/api/model/detect"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ upload_id, threshold_percentile, file }) }).then(j<Summary>),
  records: (sid: string, q: URLSearchParams) => fetch(apiUrl(`/api/analysis/${sid}/records?${q}`)).then(j<{ total: number; records: Rec[] }>),
  detail: (sid: string, rid: number) => fetch(apiUrl(`/api/analysis/${sid}/records/${rid}`)).then(j<Detail>),
};
