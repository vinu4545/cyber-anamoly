import React, { useState, useEffect } from "react";
import {
  Database,
  Search,
  Filter,
  Layers,
  Info,
  CheckCircle,
  Download,
  AlertTriangle,
} from "lucide-react";
import { api, ColumnMeta } from "../../lib/api";

export const DatasetExplorerPage: React.FC = () => {
  const [columns, setColumns] = useState<ColumnMeta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [corrData, setCorrData] = useState<{ features: string[]; matrix: number[][] }>({ features: [], matrix: [] });

  useEffect(() => {
    loadDatasetMeta();
  }, []);

  const loadDatasetMeta = async () => {
    setLoading(true);
    try {
      const [colRes, corrRes] = await Promise.all([
        api.getColumns().catch(() => ({ columns: [] })),
        api.getCorrelation(8).catch(() => ({ features: [], matrix: [] })),
      ]);
      setColumns(colRes.columns || []);
      setCorrData(corrRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredColumns = columns.filter((col) => {
    const matchesSearch = col.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === "FEATURE") return matchesSearch && col.classification === "Feature";
    if (filterType === "LABEL") return matchesSearch && col.classification === "Target Label";
    if (filterType === "METADATA") return matchesSearch && (col.classification === "Metadata" || col.classification === "Excluded");
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-[#94AFD7]/15">
        <div>
          <div className="flex items-center gap-2">
            <Database size={18} className="text-[#00D5FF]" />
            <h1 className="font-display font-bold text-xl text-[#F4F7FC]">
              Dataset Explorer & Feature Heatmap
            </h1>
          </div>
          <p className="text-xs text-[#8795A9] mt-0.5">
            Inspect column distributions, missing ratios, zero-variance exclusions, and feature correlations
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-[#00D5FF]/10 text-[#00D5FF] border border-[#00D5FF]/30 font-semibold">
            61 Active Features
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#7967FF]/10 text-[#7967FF] border border-[#7967FF]/30 font-semibold">
            1 Label (Isolated)
          </span>
        </div>
      </div>

      {/* Feature Search & Filtration */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl glass-panel">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5B6B80]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search column names..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#080B12] border border-[#94AFD7]/15 text-xs text-[#F4F7FC] placeholder-[#5B6B80] focus:outline-none focus:border-[#00D5FF]/40 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          {["ALL", "FEATURE", "LABEL", "METADATA"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterType === f
                  ? "bg-[#00D5FF]/15 text-[#00D5FF] font-bold border border-[#00D5FF]/30"
                  : "text-[#8795A9] hover:text-[#F4F7FC]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Columns Table */}
      <div className="p-6 rounded-2xl glass-panel border border-[#94AFD7]/15 overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#94AFD7]/15 text-[#5B6B80]">
              <th className="pb-3">COLUMN NAME</th>
              <th className="pb-3">ROLE CLASSIFICATION</th>
              <th className="pb-3">DATA TYPE</th>
              <th className="pb-3">MISSING VALUES</th>
              <th className="pb-3">UNIQUE VALUES</th>
              <th className="pb-3 text-right">STATISTICAL RANGE (MIN / MAX / MEAN)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#94AFD7]/10">
            {filteredColumns.map((c) => (
              <tr key={c.name} className="hover:bg-[#172334]/60 transition-colors">
                <td className="py-3 text-[#F4F7FC] font-semibold">{c.name}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.classification === "Feature"
                        ? "bg-[#00D5FF]/15 text-[#00D5FF] border border-[#00D5FF]/30"
                        : c.classification === "Target Label"
                        ? "bg-[#7967FF]/15 text-[#7967FF] border border-[#7967FF]/30"
                        : "bg-[#172334] text-[#8795A9] border border-[#94AFD7]/10"
                    }`}
                  >
                    {c.classification}
                  </span>
                </td>
                <td className="py-3 text-[#8795A9]">{c.dtype}</td>
                <td className="py-3">
                  <span className={c.null_count > 0 ? "text-[#FFB547]" : "text-[#19D995]"}>
                    {c.null_count} ({c.null_percentage}%)
                  </span>
                </td>
                <td className="py-3 text-[#8795A9]">{c.unique_count.toLocaleString()}</td>
                <td className="py-3 text-right text-[#8795A9]">
                  {c.stats?.min !== undefined
                    ? `${c.stats.min.toLocaleString()} / ${c.stats.max?.toLocaleString()} (μ: ${c.stats.mean?.toLocaleString()})`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Correlation Matrix Heatmap */}
      {corrData.features.length > 0 && (
        <div className="p-6 rounded-2xl glass-panel border border-[#94AFD7]/15 space-y-4">
          <div>
            <h2 className="font-display font-bold text-base text-[#F4F7FC]">
              Feature Pearson Correlation Heatmap
            </h2>
            <p className="text-xs text-[#8795A9]">
              Correlation coefficients between top-variance flow features
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-9 gap-1 font-mono text-[10px] text-center">
                <div />
                {corrData.features.map((f, i) => (
                  <div key={i} className="text-[#8795A9] truncate px-1 font-semibold" title={f}>
                    {f.slice(0, 8)}..
                  </div>
                ))}

                {corrData.matrix.map((row, rIdx) => (
                  <React.Fragment key={rIdx}>
                    <div className="text-[#8795A9] text-left truncate pr-2 font-semibold" title={corrData.features[rIdx]}>
                      {corrData.features[rIdx].slice(0, 10)}..
                    </div>
                    {row.map((val, cIdx) => {
                      const abs = Math.abs(val);
                      const bg =
                        val > 0.6
                          ? "rgba(0, 213, 255, 0.4)"
                          : val < -0.3
                          ? "rgba(255, 69, 103, 0.35)"
                          : "rgba(17, 27, 41, 0.7)";

                      return (
                        <div
                          key={cIdx}
                          style={{ backgroundColor: bg }}
                          className="h-10 flex items-center justify-center rounded border border-[#94AFD7]/10 text-[#F4F7FC]"
                          title={`${corrData.features[rIdx]} vs ${corrData.features[cIdx]}: ${val}`}
                        >
                          {val.toFixed(2)}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
