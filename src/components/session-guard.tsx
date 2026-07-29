"use client";

import { useEffect } from "react";
import { useValidateSession } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { ApiError } from "@/lib/api/client";

/**
 * Silently re-validates the session against the backend on every app
 * load. If the token is expired, malformed, or belongs to a user who
 * was banned or deleted since the token was issued, the local session
 * is cleared immediately rather than surfacing a confusing error the
 * first time the user tries to do something.
 */
export function SessionGuard() {
  const { error, isError } = useValidateSession();
  const clearSession = useAuthStore((s) => s.clearSession);

  useEffect(() => {
    if (isError && error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      clearSession();
    }
  }, [isError, error, clearSession]);

  return null;
}
