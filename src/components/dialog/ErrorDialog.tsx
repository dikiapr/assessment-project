"use client";

import Lottie from "lottie-react";

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const ErrorDialog = ({
  isOpen,
  onClose,
  title = "Gagal!",
  message = "Terjadi kesalahan saat memproses data",
}: ErrorDialogProps) => {
  if (!isOpen) return null;

  const errorAnimationData = {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 120,
    w: 500,
    h: 500,
    nm: "Error Animation",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Circle",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [250, 250, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 0,
                s: [0, 0, 100],
              },
              { t: 30, s: [100, 100, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                d: 1,
                ty: "el",
                s: { a: 0, k: [200, 200] },
                p: { a: 0, k: [0, 0] },
                nm: "Ellipse Path 1",
              },
              {
                ty: "st",
                c: { a: 0, k: [0.9, 0.2, 0.2, 1] },
                o: { a: 0, k: 100 },
                w: { a: 0, k: 16 },
                lc: 2,
                lj: 1,
                ml: 4,
                nm: "Stroke 1",
              },
              {
                ty: "tr",
                p: { a: 0, k: [0, 0] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] },
                r: { a: 0, k: 0 },
                o: { a: 0, k: 100 },
              },
            ],
            nm: "Circle",
          },
        ],
        ip: 0,
        op: 120,
        st: 0,
        bm: 0,
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: "X Mark 1",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 45 },
          p: { a: 0, k: [250, 250, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 15,
                s: [0, 0, 100],
              },
              { t: 45, s: [100, 100, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "rc",
                d: 1,
                s: { a: 0, k: [120, 16] },
                p: { a: 0, k: [0, 0] },
                r: { a: 0, k: 8 },
                nm: "Rectangle Path 1",
              },
              {
                ty: "fl",
                c: { a: 0, k: [0.9, 0.2, 0.2, 1] },
                o: { a: 0, k: 100 },
                r: 1,
                nm: "Fill 1",
              },
              {
                ty: "tr",
                p: { a: 0, k: [0, 0] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] },
                r: { a: 0, k: 0 },
                o: { a: 0, k: 100 },
              },
            ],
            nm: "Rectangle 1",
          },
        ],
        ip: 0,
        op: 120,
        st: 0,
        bm: 0,
      },
      {
        ddd: 0,
        ind: 3,
        ty: 4,
        nm: "X Mark 2",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: -45 },
          p: { a: 0, k: [250, 250, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 15,
                s: [0, 0, 100],
              },
              { t: 45, s: [100, 100, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "rc",
                d: 1,
                s: { a: 0, k: [120, 16] },
                p: { a: 0, k: [0, 0] },
                r: { a: 0, k: 8 },
                nm: "Rectangle Path 1",
              },
              {
                ty: "fl",
                c: { a: 0, k: [0.9, 0.2, 0.2, 1] },
                o: { a: 0, k: 100 },
                r: 1,
                nm: "Fill 1",
              },
              {
                ty: "tr",
                p: { a: 0, k: [0, 0] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] },
                r: { a: 0, k: 0 },
                o: { a: 0, k: 100 },
              },
            ],
            nm: "Rectangle 2",
          },
        ],
        ip: 0,
        op: 120,
        st: 0,
        bm: 0,
      },
    ],
    markers: [],
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
        {/* Error Animation */}
        <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6">
          <div className="w-32 h-32 mb-2">
            <Lottie
              animationData={errorAnimationData}
              loop={false}
              autoplay={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-center">{message}</p>
        </div>

        {/* Button */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog;
