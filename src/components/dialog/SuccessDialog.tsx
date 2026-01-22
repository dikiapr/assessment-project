"use client";

import Lottie from "lottie-react";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const SuccessDialog = ({
  isOpen,
  onClose,
  title = "Berhasil!",
  message = "Data berhasil disimpan",
}: SuccessDialogProps) => {
  if (!isOpen) return null;

  const successAnimationData = {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 90,
    w: 500,
    h: 500,
    nm: "Success Animation",
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
                c: { a: 0, k: [0.133, 0.694, 0.298, 1] },
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
        op: 90,
        st: 0,
        bm: 0,
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: "Checkmark Short Line",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [250, 250, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ind: 0,
                ty: "sh",
                ks: {
                  a: 1,
                  k: [
                    {
                      i: { x: 0.833, y: 0.833 },
                      o: { x: 0.167, y: 0.167 },
                      t: 20,
                      s: [
                        {
                          i: [
                            [0, 0],
                            [0, 0],
                          ],
                          o: [
                            [0, 0],
                            [0, 0],
                          ],
                          v: [
                            [-40, 0],
                            [-40, 0],
                          ],
                          c: false,
                        },
                      ],
                    },
                    {
                      t: 45,
                      s: [
                        {
                          i: [
                            [0, 0],
                            [0, 0],
                          ],
                          o: [
                            [0, 0],
                            [0, 0],
                          ],
                          v: [
                            [-40, 0],
                            [-15, 25],
                          ],
                          c: false,
                        },
                      ],
                    },
                  ],
                },
              },
              {
                ty: "st",
                c: { a: 0, k: [0.133, 0.694, 0.298, 1] },
                o: { a: 0, k: 100 },
                w: { a: 0, k: 14 },
                lc: 2,
                lj: 2,
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
            nm: "Short Line",
          },
        ],
        ip: 0,
        op: 90,
        st: 0,
        bm: 0,
      },
      {
        ddd: 0,
        ind: 3,
        ty: 4,
        nm: "Checkmark Long Line",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [250, 250, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ind: 0,
                ty: "sh",
                ks: {
                  a: 1,
                  k: [
                    {
                      i: { x: 0.833, y: 0.833 },
                      o: { x: 0.167, y: 0.167 },
                      t: 30,
                      s: [
                        {
                          i: [
                            [0, 0],
                            [0, 0],
                          ],
                          o: [
                            [0, 0],
                            [0, 0],
                          ],
                          v: [
                            [-15, 25],
                            [-15, 25],
                          ],
                          c: false,
                        },
                      ],
                    },
                    {
                      t: 60,
                      s: [
                        {
                          i: [
                            [0, 0],
                            [0, 0],
                          ],
                          o: [
                            [0, 0],
                            [0, 0],
                          ],
                          v: [
                            [-15, 25],
                            [45, -35],
                          ],
                          c: false,
                        },
                      ],
                    },
                  ],
                },
              },
              {
                ty: "st",
                c: { a: 0, k: [0.133, 0.694, 0.298, 1] },
                o: { a: 0, k: 100 },
                w: { a: 0, k: 14 },
                lc: 2,
                lj: 2,
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
            nm: "Long Line",
          },
        ],
        ip: 0,
        op: 90,
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
        {/* Success Animation */}
        <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6">
          <div className="w-32 h-32 mb-2">
            <Lottie
              animationData={successAnimationData}
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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessDialog;
