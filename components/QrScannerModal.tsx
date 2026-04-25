
import React, { useEffect, useRef } from 'react';

declare const Html5Qrcode: any;

interface QrScannerModalProps {
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ onClose, onScanSuccess }) => {
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("qr-reader");
    let didScan = false;

    const startScanner = async () => {
        try {
            await scannerRef.current.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
                        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                        const qrboxSize = Math.floor(minEdge * 0.8);
                        return {
                            width: qrboxSize,
                            height: qrboxSize,
                        };
                    },
                },
                (decodedText: string, decodedResult: any) => {
                    if (!didScan) {
                        didScan = true;
                        onScanSuccess(decodedText);
                    }
                },
                (errorMessage: string) => {
                    // ignore errors
                }
            );
        } catch (err) {
            console.error("QR Scanner failed to start:", err);
            onClose();
        }
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((err: any) => {
          console.error("Failed to stop the QR scanner.", err);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-950 p-4 rounded-sm shadow-2xl border border-cyan-500/50 w-full max-w-md">
        <h3 className="text-sm font-black text-center mb-4 text-cyan-400 uppercase tracking-widest border-b border-cyan-500/10 pb-2">Escanear QR de Wi-Fi</h3>
        <div id="qr-reader" className="w-full rounded-sm overflow-hidden border border-cyan-900"></div>
        <button
          onClick={onClose}
          className="w-full mt-4 bg-cyan-950/20 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black text-cyan-400 font-bold py-2 px-4 uppercase text-xs transition-all"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
