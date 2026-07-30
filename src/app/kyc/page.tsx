"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowLeft,
  UploadCloud,
  FileCheck,
  Building2,
  User,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function KycPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme(); // Global theme sync

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Bishal Singh Deo",
    companyName: "MatchToCollege Tech",
    panNumber: "",
    aadhaarNumber: "",
    businessType: "Sole Proprietorship",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
    }, 1200);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 pb-16 ${
        isDarkMode
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Top Navbar Header */}
      <header
        className={`sticky top-0 z-20 border-b backdrop-blur-md transition-colors ${
          isDarkMode
            ? "bg-slate-900/80 border-slate-800"
            : "bg-white/80 border-slate-200 shadow-sm"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className={`p-2 rounded-xl border transition-colors ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-bold text-base leading-tight">
                Enterprise KYC Verification
              </h1>
              <p
                className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Identity & Regulatory Compliance Portal
              </p>
            </div>
          </div>

          {/* Synced Theme Switcher Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Body Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        {formSubmitted ? (
          /* Verification Submitted Card */
          <div
            className={`border rounded-2xl p-8 text-center max-w-lg mx-auto shadow-lg transition-colors ${
              isDarkMode
                ? "bg-slate-900/80 border-slate-800"
                : "bg-white border-slate-200 shadow-slate-200/50"
            }`}
          >
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">KYC Documents Submitted!</h2>
            <p
              className={`text-xs mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              Aapke documents verification under process hain. Normal response
              time 2–4 hours hota hai.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-xs transition-all shadow-md shadow-blue-500/20"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          /* KYC Form Card */
          <div
            className={`border rounded-2xl p-6 sm:p-8 shadow-sm transition-colors ${
              isDarkMode
                ? "bg-slate-900/60 border-slate-800"
                : "bg-white border-slate-200/80"
            }`}
          >
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200/20">
              <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  Identity Verification (KYC)
                </h2>
                <p
                  className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                >
                  Required for compliance & unthrottled enterprise bandwidth
                  access
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grid 1: Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                      isDarkMode ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    Full Authorized Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 ${
                        isDarkMode
                          ? "bg-slate-950 border-slate-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                      isDarkMode ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    Registered Entity / Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 ${
                        isDarkMode
                          ? "bg-slate-950 border-slate-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Grid 2: Government IDs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                      isDarkMode ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    PAN Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      value={formData.panNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          panNumber: e.target.value.toUpperCase(),
                        })
                      }
                      className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm uppercase font-mono focus:outline-none focus:border-blue-500 ${
                        isDarkMode
                          ? "bg-slate-950 border-slate-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                      isDarkMode ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    12-Digit Aadhaar Number
                  </label>
                  <div className="relative">
                    <FileCheck className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="1234 5678 9012"
                      maxLength={12}
                      value={formData.aadhaarNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          aadhaarNumber: e.target.value,
                        })
                      }
                      className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:border-blue-500 ${
                        isDarkMode
                          ? "bg-slate-950 border-slate-800 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Document Drag-and-Drop Area */}
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  Upload Business Registration / ID Proof (PDF or Image)
                </label>
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                    isDarkMode
                      ? "border-slate-800 hover:border-blue-500 bg-slate-950/40"
                      : "border-slate-200 hover:border-blue-500 bg-slate-50"
                  }`}
                >
                  <UploadCloud className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                  <p className="text-xs font-semibold">
                    Click to upload or drag & drop files
                  </p>
                  <p
                    className={`text-[11px] mt-1 ${
                      isDarkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Maximum file size: 10MB (PDF, PNG, JPG)
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                {loading
                  ? "Submitting Documents..."
                  : "Submit Verification Request"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
