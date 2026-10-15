import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PROCESSING_ROUTES } from "@/navigation/resolveRoute";

// Thin wrapper around react-router's navigate that keeps Processing screens
// out of browser history (DESIGN-HANDOFF.md §3: "Processing screens must
// stay no way out" — a back-nav into a mid-flight check is not a valid
// state to resume into). Every other route pushes normally so Back works
// as expected across the rest of the wizard.
export function useHistorySync() {
  const navigate = useNavigate();

  return useCallback(
    (path: string) => {
      navigate(path, { replace: PROCESSING_ROUTES.has(path) });
    },
    [navigate],
  );
}
