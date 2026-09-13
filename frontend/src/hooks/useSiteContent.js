import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useSiteContent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    api.get("/content").then((r) => setData(r.data)).catch((e) => setError(e));
  }, []);
  return { data, error, loading: !data && !error };
}
