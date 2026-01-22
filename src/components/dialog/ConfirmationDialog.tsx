"use client";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  isLoading?: boolean;
}

const ConfirmationDialog = ({
  isOpen,
  onCancel,
  onConfirm,
  title = "Apa Anda Yakin?",
  description = "Data yang diajukan tidak bisa diubah",
  cancelText = "Batal",
  confirmText = "Ya, saya yakin",
  isLoading = false,
}: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.64)" }}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="border border-gray-200 rounded-2xl shadow-xl max-w-md w-full bg-white p-8">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-[#7D1F1F] text-center mb-3">
            {title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-center mb-8">{description}</p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className={`flex-1 bg-white border border-[#7D1F1F] text-[#7D1F1F] font-semibold py-3 rounded-lg transition-colors duration-200 hover:bg-red-50 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 bg-[#7D1F1F] hover:bg-red-800 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                isLoading ? "opacity-90 cursor-wait" : ""
              }`}
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
