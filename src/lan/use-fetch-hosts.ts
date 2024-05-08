import { useEffect, useState } from "react";
import { Host } from "./types";

export default function useFetchHosts(setHosts: (hosts: Host[]) => void) {
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHosts = async () => {
      setIsPending(true);
      try {
        const response = await fetch("http://localhost:8000/monitor/hosts");
        const hosts = await response.json();
        setHosts(hosts);
      } catch (error) {
        setError(new Error());
      } finally {
        setIsPending(false);
      }
    };

    fetchHosts();
  }, []);

  return {
    isPending,
    error,
  };
}
