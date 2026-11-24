import { animate } from "framer-motion";
import { useEffect, useState } from "react";
export default function Counter({ to, dec = 0, suffix = "" }: { to: number; dec?: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => { const c = animate(0, to, { duration: 1.1, ease: "easeOut", onUpdate: setV }); return () => c.stop(); }, [to]);
  return <>{v.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec })}{suffix}</>;
}
