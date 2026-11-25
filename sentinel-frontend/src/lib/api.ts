export interface HealthResponse {
  status: string;
  timestamp: string;
  model_loaded: boolean;
  active_dataset?: string;
  data_mode?: string;
  database_connected: boolean;
  uptime_seconds?: number;
}

export interface DatasetUploadResponse {
  file_name: string;
  upload_id?: string;
  total_rows: number;
  total_columns: number;
  has_labels: boolean;
  labels_found?: string[];
  label_present?: boolean;
  label_counts?: Record<string, number>;
  has_ip_data?: boolean;
  has_timestamps?: boolean;
  column_names?: string[];
  missing_values_count?: number;
  infinite_values_count?: number;
  duplicate_rows_count?: number;
  health_score?: number;
  compatible?: boolean;
  missing_model_features?: string[];
  preview?: Record<string, any>[];
  data_mode?: string;
  message?: string;
}

export interface DatasetSummary {
  file_name: string;
  data_mode?: string;
  total_rows: number;
  total_columns: number;
  numeric_columns_count: number;
  missing_values_count: number;
  infinite_values_count: number;
  duplicate_rows_count: number;
  health_score: number;
  health_breakdown?: {
    missing_penalty: number;
    inf_penalty: number;
    duplicate_penalty: number;
  };
  has_labels: boolean;
  has_ip_data?: boolean;
  has_timestamps?: boolean;
  class_distribution: Record<string, number>;
}

export interface ColumnMeta {
  name: string;
  dtype: string;
  classification: "Feature" | "Target Label" | "Metadata" | "Excluded";
  null_count: number;
  null_percentage: number;
  unique_count: number;
  stats: {
    min?: number;
    max?: number;
    mean?: number;
    std?: number;
  };
}

export interface ModelMetrics {
  session_id?: string;
  algorithm: string;
  dataset_size?: number;
  anomaly_count?: number;
  normal_count?: number;
  anomaly_rate?: number;
  duration_seconds?: number;
  contamination?: number;
  has_evaluation: boolean;
  metrics?: {
    precision: number;
    recall: number;
    f1_score: number;
    accuracy?: number;
    false_positive_rate: number;
    roc_auc: number;
    pr_auc: number;
    confusion_matrix: {
      true_negatives: number;
      false_positives: number;
      false_negatives: number;
      true_positives: number;
    };
    roc_curve: { fpr: number; tpr: number }[];
    pr_curve: { recall: number; precision: number }[];
    ground_truth_counts: Record<string, number>;
    total_attack_records: number;
    total_benign_records: number;
  };
  models?: any[];
  tradeoff?: any[];
  importance?: any[];
}

export interface RecordItem {
  id?: number;
  record_id: string | number;
  session_id?: string;
  source_ip?: string;
  destination_ip?: string;
  source_port?: number;
  destination_port?: number;
  protocol?: string;
  timestamp?: string;
  flow_duration?: number;
  total_fwd_packets?: number;
  total_bwd_packets?: number;
  flow_bytes_s?: number;
  flow_packets_s?: number;
  anomaly_score: number;
  prediction: "NORMAL" | "ANOMALOUS";
  ground_truth_label?: string | null;
  actual_label?: string | null;
  top_deviations?: {
    feature: string;
    value: number;
    baseline_median?: number;
    baseline_iqr?: number;
    z_score: number;
    direction?: string;
    narrative?: string;
    typical_normal?: number;
  }[];
  deviations?: any[];
  raw_features?: Record<string, any>;
}

export interface InvestigationItem {
  investigation_id?: string;
  id?: string;
  session_id?: string;
  record_id: string | number;
  source_ip?: string;
  destination_ip?: string;
  destination_port?: number;
  protocol?: string;
  timestamp?: string;
  anomaly_score: number;
  score?: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "NEW" | "UNDER_INVESTIGATION" | "RESOLVED" | "FALSE_POSITIVE" | "New" | "Under Investigation" | "Resolved" | "False Positive";
  ground_truth_label?: string | null;
  analyst_notes?: string;
  audit_trail?: { timestamp: string; action: string; status: string; notes: string }[];
  created_at: string;
  updated_at?: string;
}

export interface DetectionJobStatus {
  job_id: string;
  stage: string;
  stage_index: number;
  total_stages: number;
  progress_percent: number;
  message: string;
  is_completed: boolean;
  is_failed: boolean;
  session_id?: string;
  error?: string;
}

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = errorBody.detail || errorBody.message || `Request failed with status ${res.status}`;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }
  return res.json();
}

export const api = {
  getHealth: () => request<HealthResponse>("/api/health"),

  uploadDataset: async (file: File): Promise<DatasetUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    return request<DatasetUploadResponse>("/api/dataset/upload", {
      method: "POST",
      body: formData,
    });
  },

  loadDemoDataset: () => request<DatasetUploadResponse>("/api/dataset/demo", { method: "POST" }),

  getSummary: (uploadId?: string) => request<DatasetSummary>(`/api/dataset/summary${uploadId ? `?upload_id=${uploadId}` : ""}`),

  getColumns: (uploadId?: string) => request<{ columns: ColumnMeta[] }>(`/api/dataset/columns${uploadId ? `?upload_id=${uploadId}` : ""}`),

  getPreview: (limit: number = 20) => request<{ columns: string[]; total_rows: number; preview_rows: Record<string, any>[] }>(`/api/dataset/preview?limit=${limit}`),

  getCorrelation: (topN: number = 8) => request<{ features: string[]; matrix: number[][] }>(`/api/dataset/correlation?top_n=${topN}`),

  startDetection: (config: {
    contamination?: number;
    n_estimators?: number;
    train_normal_only?: boolean;
    upload_id?: string;
    threshold_percentile?: number;
  }) => request<{ job_id?: string; session_id?: string; message?: string }>("/api/model/detect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  }),

  getDetectionProgress: (jobId: string) => request<DetectionJobStatus>(`/api/model/detect/${jobId}/progress`),

  getModelMetrics: (sessionId?: string) => request<ModelMetrics>(`/api/model/metrics${sessionId ? `?session_id=${sessionId}` : ""}`),

  getModelConfig: () => request<any>("/api/model/config"),

  compareModels: (maxSamples: number = 1200) => request<any>(`/api/model/compare?max_samples=${maxSamples}`, { method: "POST" }),

  getHistory: () => request<{ sessions?: any[] } | any[]>("/api/analysis/history"),

  getSession: (sessionId: string) => request<any>(`/api/analysis/${sessionId}`),

  getRecords: (
    sessionId: string,
    params: {
      page?: number;
      page_size?: number;
      filter_type?: string;
      search?: string;
      sort_by?: string;
      sort_order?: string;
    } = {}
  ) => {
    const qs = new URLSearchParams();
    if (params.page) qs.append("page", params.page.toString());
    if (params.page_size) qs.append("page_size", params.page_size.toString());
    if (params.filter_type) qs.append("filter_type", params.filter_type);
    if (params.search) qs.append("search", params.search);
    if (params.sort_by) qs.append("sort_by", params.sort_by);
    if (params.sort_order) qs.append("sort_order", params.sort_order);
    return request<{
      page: number;
      page_size: number;
      total_records?: number;
      total?: number;
      total_pages?: number;
      records: RecordItem[];
    }>(`/api/analysis/${sessionId}/records?${qs.toString()}`);
  },

  getRecordDetail: (sessionId: string, recordId: string | number) =>
    request<RecordItem>(`/api/analysis/${sessionId}/records/${recordId}`),

  deleteSession: (sessionId: string) => request<{ message: string }>(`/api/analysis/${sessionId}`, { method: "DELETE" }),

  getInvestigations: (status?: string, severity?: string, search?: string) => {
    const qs = new URLSearchParams();
    if (status) qs.append("status", status);
    if (severity) qs.append("severity", severity);
    if (search) qs.append("search", search);
    return request<{ investigations: InvestigationItem[] } | InvestigationItem[]>(`/api/investigations?${qs.toString()}`);
  },

  updateInvestigation: (
    id: string,
    data: { status?: string; severity?: string; analyst_notes?: string }
  ) =>
    request<InvestigationItem>(`/api/investigations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  search: (query: string) => request<{ query: string; results: any[] }>(`/api/search?q=${encodeURIComponent(query)}`),

  exportPdfUrl: (sessionId?: string) => `/api/export/pdf${sessionId ? `?session_id=${sessionId}` : ""}`,
  exportCsvUrl: (sessionId?: string) => `/api/export/csv${sessionId ? `?session_id=${sessionId}` : ""}`,
};
