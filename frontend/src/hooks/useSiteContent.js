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
          setData({
            ...defaultData,
            ...r.data,
            settings: {
              ...defaultData.settings,
              ...(r.data.settings || {}),
            },
            programs: r.data.programs ?? defaultData.programs,
            tutors: r.data.tutors ?? defaultData.tutors,
            packages: r.data.packages ?? defaultData.packages,
            faqs: r.data.faqs ?? defaultData.faqs,
          });
        }
      })
      .catch((e) => {
        console.warn("Backend not available, using default content:", e);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, error, loading };
}

