"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wifi,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  KeyRound,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function AuthPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [step, setStep] = useState<"MOBILE" | "OTP">("MOBILE");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      setError("Kripya valid 10-digit mobile number enter karein.");
      return;
    }
    setError("");
    setStep("OTP");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "VERIFY_OTP",
          mobile,
          otp,
          name: name || "Bishal Singh Deo",
        }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("wifi_user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (_err) {
      setError("Server Error! Kripya phir se try karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 flex flex-col justify-center items-center p-4 relative ${
        isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Top Right Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div
        className={`w-full max-w-md border backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10 transition-colors ${
          isDarkMode
            ? "bg-slate-900/80 border-slate-800"
            : "bg-white border-slate-200 shadow-slate-200/50"
        }`}
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-blue-600/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-4">
            <Wifi className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold font-sans">
            High-Speed WiFi Access
          </h1>
          <p
            className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            Enterprise User Management & Authentication
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs text-center">
            {error}
          </div>
        )}

        {step === "MOBILE" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
              >
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Bishal Singh Deo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 ${
                  isDarkMode
                    ? "bg-slate-950 border-slate-800"
                    : "bg-slate-50 border-slate-200"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
              >
                Mobile Number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="+91 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 ${
                    isDarkMode
                      ? "bg-slate-950 border-slate-800"
                      : "bg-slate-50 border-slate-200"
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/25 mt-2"
            >
              Get Verification Code
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center mb-4">
              <span
                className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                OTP sent to{" "}
                <span className="text-blue-500 font-mono">{mobile}</span>
              </span>
              <p className="text-[11px] text-amber-500 mt-1">
                💡 Testing Helper: Enter code{" "}
                <strong className="font-mono">123456</strong>
              </p>
            </div>

            <div>
              <label
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
              >
                Enter 6-Digit OTP
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm tracking-widest font-mono text-center text-lg focus:outline-none focus:border-blue-500 ${
                    isDarkMode
                      ? "bg-slate-950 border-slate-800"
                      : "bg-slate-50 border-slate-200"
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/25"
            >
              {loading ? "Verifying..." : "Verify & Connect WiFi"}
            </button>

            <button
              type="button"
              onClick={() => setStep("MOBILE")}
              className={`w-full text-xs py-1 transition-colors ${isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
            >
              ← Change Mobile Number
            </button>
          </form>
        )}

        <div
          className={`mt-8 pt-6 border-t flex items-center justify-center gap-2 text-xs ${
            isDarkMode
              ? "border-slate-800 text-slate-500"
              : "border-slate-100 text-slate-400"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>WPA3 Enterprise Encryption Active</span>
        </div>
      </div>
    </div>
  );
}
