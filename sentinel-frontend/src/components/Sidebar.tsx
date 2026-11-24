import { motion } from "framer-motion";
import { Activity, BarChart3, BookOpen, Database, FlaskConical, FolderKanban, Gauge, History, Info, Network, Radar, ScanSearch, Settings, ShieldAlert, ChevronsLeft } from "lucide-react";
import type { ComponentType } from "react";
export const NAV: { group: string; items: { id: string; label: string; icon: ComponentType<{ size?: number }> }[] }[] = [
  { group: "MAIN", items: [{ id: "overview", label: "Overview", icon: Gauge }, { id: "live", label: "Live Monitor", icon: Activity }, { id: "analyzer", label: "Traffic Analyzer", icon: ScanSearch }, { id: "invest", label: "Threat Investigations", icon: ShieldAlert }, { id: "intel", label: "Network Intelligence", icon: Network }] },
  { group: "ANALYTICS", items: [{ id: "analytics", label: "Security Analytics", icon: BarChart3 }, { id: "history", label: "Detection History", icon: History }] },
  { group: "PROJECT WORKSPACE", items: [{ id: "work", label: "Project Work", icon: FolderKanban }, { id: "dataset", label: "Dataset Explorer", icon: Database }, { id: "lab", label: "Model Laboratory", icon: FlaskConical }, { id: "method", label: "Methodology", icon: BookOpen }] },
  { group: "SYSTEM", items: [{ id: "settings", label: "Settings", icon: Settings }, { id: "about", label: "About SENTINEL", icon: Info }] },
];
export default function Sidebar({ page, setPage, open, toggle }: { page: string; setPage: (p: string) => void; open: boolean; toggle: () => void }) {
  return (
    <motion.aside animate={{ width: open ? 250 : 68 }} className="h-screen sticky top-0 shrink-0 border-r border-line bg-bg2/90 overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 px-4 h-16 border-b border-line"><Radar className="text-cy shrink-0" /><span className={`font-display font-bold tracking-wide ${open ? "" : "hidden"}`}>SENTINEL <span className="text-cy">AI</span></span></div>
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV.map((g) => (<div key={g.group} className="mb-3">{open && <div className="px-5 py-1 text-[10px] tracking-[.18em] text-mut">{g.group}</div>}
          {g.items.map(({ id, label, icon: I }) => (<button key={id} onClick={() => setPage(id)} title={label} className={`w-full flex items-center gap-3 px-5 py-2 text-sm transition ${page === id ? "text-cy bg-cy/10 border-r-2 border-cy" : "text-mut hover:text-tx hover:bg-elev"}`}><I size={18} />{open && label}</button>))}</div>))}
      </nav>
      <button onClick={toggle} className="p-4 text-mut hover:text-cy border-t border-line flex justify-center"><ChevronsLeft className={open ? "" : "rotate-180"} /></button>
    </motion.aside>
  );
}
