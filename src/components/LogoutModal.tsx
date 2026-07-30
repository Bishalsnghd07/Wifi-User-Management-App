// "use client";

// import { LogOut, AlertTriangle, X } from "lucide-react";
// import { useTheme } from "@/context/ThemeContext";

// interface LogoutModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
// }

// export default function LogoutModal({
//   isOpen,
//   onClose,
//   onConfirm,
// }: LogoutModalProps) {
//   const { isDarkMode } = useTheme();

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
//       <div
//         className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl transition-all scale-100 ${
//           isDarkMode
//             ? "bg-slate-900 border-slate-800 text-white"
//             : "bg-white border-slate-200 text-slate-900"
//         }`}
//       >
//         {/* Top Header Icon & Close */}
//         <div className="flex items-start justify-between mb-4">
//           <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
//             <AlertTriangle className="w-6 h-6" />
//           </div>
//           <button
//             onClick={onClose}
//             className={`p-1.5 rounded-lg transition-colors ${
//               isDarkMode
//                 ? "hover:bg-slate-800 text-slate-400"
//                 : "hover:bg-slate-100 text-slate-500"
//             }`}
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         {/* Content */}
//         <div>
//           <h3 className="text-base font-bold">Logout Confirmation</h3>
//           <p
//             className={`text-xs mt-1 leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
//           >
//             Are you sure you want to log out? You will need to sign in again to
//             access your dashboard.
//           </p>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center gap-3 mt-6">
//           <button
//             type="button"
//             onClick={onClose}
//             className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors border ${
//               isDarkMode
//                 ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
//                 : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
//             }`}
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={onConfirm}
//             className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-600/20"
//           >
//             <LogOut className="w-3.5 h-3.5" />
//             Yes, Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { LogOut, AlertTriangle, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  const { isDarkMode } = useTheme();

  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 200); // 200ms duration matching Tailwind transition
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!shouldRender) return null;

  return (
    /* 1. Backdrop Overlay (Background Blur & Fade) */
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-200 ${
        isClosing ? "opacity-0" : "opacity-100 animate-in fade-in"
      }`}
    >
      {/* 2. YE RAHI AAPKI SNIPPET (Inner Modal Box) */}
      <div
        className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl transition-all duration-400 ${
          isDarkMode
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900"
        } ${
          isClosing
            ? "opacity-0 translate-y-8 scale-95"
            : "opacity-100 translate-y-0 scale-100 animate-in fade-in slide-in-from-bottom-8"
        }`}
      >
        {/* Header Icon & Close Button */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={handleClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDarkMode
                ? "hover:bg-slate-800 text-slate-400"
                : "hover:bg-slate-100 text-slate-500"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-base font-bold">Confirm Logout</h3>
          <p
            className={`text-xs mt-1 leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            Are you sure you want to log out? You will need to sign in again to
            access your dashboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={handleClose}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors border ${
              isDarkMode
                ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
                : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-600/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}
