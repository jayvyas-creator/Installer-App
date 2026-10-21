import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  });

  const stopDecodeLoop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    stopDecodeLoop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsScanning(false);
    setTorchOn(false);
  }, [stopDecodeLoop]);

  useEffect(() => stop, [stop]);

  // Reads frames off the live video feed looking for a QR code, using jsQR
  // (a pure-JS decoder) rather than the native BarcodeDetector API — the
  // latter has no Safari/iOS support, which this field-technician app can't
  // assume away. Stops itself once a code is found or scanning is stopped.
  const runDecodeLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    const tick = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(frame.data, frame.width, frame.height);
        if (code?.data) {
          stop();
          onResultRef.current(code.data);
          return;
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [stop]);

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
      runDecodeLoop();
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") setError("permission-denied");
      else if (err instanceof DOMException && err.name === "NotFoundError") setError("no-camera");
      else if (err instanceof DOMException && err.name === "NotReadableError") setError("camera-busy");
      else setError("unknown");
    }
  }, [runDecodeLoop]);

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

  // Mock-mode / design-review escape hatch, hidden outside VITE_USE_MOCKS —
  // the real decode loop above is what a production build relies on.
  const simulateScan = useCallback(
    (value: string) => {
      stop();
      onResult(value);
    },
    [onResult, stop],
  );

  return { videoRef, isScanning, error, start, stop, torchOn, torchSupported, toggleTorch, simulateScan };
}
