import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { defaultData } from "@/lib/defaultData";

export function useSiteContent() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api
      .get("/content")
      .then((r) => {
        if (isMounted && r.data) {
          setData(r.data);
        }
      })
      .catch((e) => {
        console.warn("Backend not available, using default content:", e);
        // We keep defaultData so the landing page renders smoothly
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, error, loading };
}

