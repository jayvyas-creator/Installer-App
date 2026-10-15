import { useCallback, useEffect, useRef, useState } from "react";

// The 5 camera-unavailable variants DESIGN-HANDOFF.md §2.1 calls for.
export type QrScannerError =
  | "insecure-context"
  | "permission-denied"
  | "no-camera"
  | "camera-busy"
  | "unknown";

interface UseQrScannerOptions {
  onResult: (value: string) => void;
}

export function useQrScanner({ onResult }: UseQrScannerOptions) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<QrScannerError | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsScanning(false);
    setTorchOn(false);
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(async () => {
    setError(null);
    if (!window.isSecureContext) {
      setError("insecure-context");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("no-camera");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      const [track] = stream.getVideoTracks();
      const capabilities = track.getCapabilities?.() as { torch?: boolean } | undefined;
      setTorchSupported(Boolean(capabilities?.torch));
      setIsScanning(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") setError("permission-denied");
      else if (err instanceof DOMException && err.name === "NotFoundError") setError("no-camera");
      else if (err instanceof DOMException && err.name === "NotReadableError") setError("camera-busy");
      else setError("unknown");
    }
  }, []);

  const toggleTorch = useCallback(async () => {
    const [track] = streamRef.current?.getVideoTracks() ?? [];
    if (!track) return;
    try {
      await track.applyConstraints({
        advanced: [{ torch: !torchOn } as MediaTrackConstraintSet],
      });
      setTorchOn((value) => !value);
    } catch {
      // Reported as a capability but rejected at apply time — leave torch off.
    }
  }, [torchOn]);

  // Mock-mode / design-review escape hatch — no real decoder is wired in yet.
  // TODO(api): replace with a real QR decode loop (e.g. BarcodeDetector)
  // reading frames off videoRef once a camera is attached.
  const simulateScan = useCallback(
    (value: string) => {
      stop();
      onResult(value);
    },
    [onResult, stop],
  );

  return { videoRef, isScanning, error, start, stop, torchOn, torchSupported, toggleTorch, simulateScan };
}
