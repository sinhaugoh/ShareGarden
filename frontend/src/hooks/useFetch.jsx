import { useEffect, useState } from "react";

export default function useFetch(url, options) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async function () {
      try {
        setIsLoading(true);
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.status === 400) {
          setError(data);
        } else if (response.status > 400 && response.status < 600) {
          throw new Error(`Error with status: ${response.status}`);
        }

        setData(data);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [url, options]);

  return { data, isLoading, error };
}
