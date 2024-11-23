import { useSetAtom } from "jotai";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { isHealthyAtom } from "@/global/health-check";

type HealthCheck = () => Promise<boolean>;

export const useHealthCheck = () => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const setIsHealthy = useSetAtom(isHealthyAtom);

  const checkHealth = useCallback(
    async (healthCheck: HealthCheck): Promise<boolean> => {
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve(false);
        }, 3000);

        healthCheck?.().then((result) => {
          clearTimeout(timeout);
          resolve(result === true);
        });
      });
    },
    []
  );

  const stopHealthCheck = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startHealthCheck = useCallback(
    (healthCheck: HealthCheck) => {
      if (timerRef.current) return;

      timerRef.current = setInterval(async () => {
        const isHealthy = await checkHealth(healthCheck);
        if (isHealthy) {
          setIsHealthy("open");
        } else {
          setIsHealthy("closed");
          toast.error("iframeとの接続が解除されました。");
          stopHealthCheck();
        }
      }, 5000);
    },
    [checkHealth, setIsHealthy, stopHealthCheck]
  );

  return { startHealthCheck, stopHealthCheck };
};
