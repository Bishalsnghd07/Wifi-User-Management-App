"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wifi,
  Laptop,
  Smartphone,
  Tablet,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Activity,
  HardDriveUpload,
  Clock,
  LogOut,
  Power,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import LogoutModal from "@/components/LogoutModal";
import { useRouter } from "next/navigation";

interface Device {
  id: string;
  deviceName: string;
  deviceType: string;
  macAddress: string;
  status: "ONLINE" | "OFFLINE" | "BLOCKED";
  createdAt?: string;
}

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    companyName: string;
    kycStatus: string;
  };
  stats: {
    totalDataGB: string;
    activeDevicesCount: number;
    totalDevicesCount: number;
  };
  devices: Device[];
  chartData: { date: string; dataGB: number; sessionMins: number }[];
}

export default function DashboardPage() {
  const { isDarkMode } = useTheme();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // New Device Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("Laptop");
  const [macAddress, setMacAddress] = useState("");
  const [addError, setAddError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("wifi_user");
    router.push("/");
  };

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const result = await res.json();
      if (result.success) {
        setData(result);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      fetchDashboard();
    });
  }, []);

  const handleToggleStatus = async (
    deviceId: string,
    currentStatus: string,
  ) => {
    const nextStatus = currentStatus === "ONLINE" ? "OFFLINE" : "ONLINE";
    try {
      await fetch("/api/devices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, status: nextStatus }),
      });
      fetchDashboard();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");

    if (!data?.user.id) return;

    try {
      const res = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data.user.id,
          deviceName,
          deviceType,
          macAddress,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setShowAddModal(false);
        setDeviceName("");
        setMacAddress("");
        fetchDashboard();
      } else {
        setAddError(result.error || "Failed to add device");
      }
    } catch (_err) {
      setAddError("Server error while adding device");
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
          isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-800"
        }`}
      >
        <div className="flex items-center gap-3 text-blue-500 font-medium">
          <Activity className="w-6 h-6 animate-spin" />
          <span>Loading Telemetry Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 pb-16 ${
        isDarkMode
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Navbar Header */}
      <header
        className={`sticky top-0 z-20 border-b backdrop-blur-md transition-colors ${
          isDarkMode
            ? "bg-slate-900/80 border-slate-800"
            : "bg-white/80 border-slate-200 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">
                WiFi Control Engine
              </h1>
              <p
                className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                User: <span className="font-semibold">{data?.user.name}</span> (
                {data?.user.companyName})
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/kyc"
              className={`text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 font-semibold border transition-colors ${
                data?.user.kycStatus === "VERIFIED"
                  ? isDarkMode
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : isDarkMode
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-amber-50 border-amber-200 text-amber-700"
              }`}
            >
              {data?.user.kycStatus === "VERIFIED" ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5" />
              )}
              KYC: {data?.user.kycStatus}
            </Link>

            {/* Header Controls Area */}
            <div className="flex items-center gap-3">
              {/* Clean Logout Trigger Button (No Link Wrapper) */}
              <button
                onClick={() => setShowLogoutModal(true)}
                type="button"
                className={`p-2 rounded-xl transition-colors ${
                  isDarkMode
                    ? "text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    : "text-slate-500 hover:text-red-600 hover:bg-red-50"
                }`}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
      {/* Modern Logout Modal */}

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`border rounded-2xl p-6 shadow-sm transition-all ${
              isDarkMode
                ? "bg-slate-900/60 border-slate-800"
                : "bg-white border-slate-200/80 hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Total Data Consumed
              </span>
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <HardDriveUpload className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono">
                {data?.stats.totalDataGB}
              </span>
              <span
                className={`text-sm font-semibold ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                GB
              </span>
            </div>
            <p
              className={`text-xs mt-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
            >
              Rolling 7-day usage telemetry
            </p>
          </div>

          <div
            className={`border rounded-2xl p-6 shadow-sm transition-all ${
              isDarkMode
                ? "bg-slate-900/60 border-slate-800"
                : "bg-white border-slate-200/80 hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Active Devices
              </span>
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono">
                {data?.stats.activeDevicesCount}
              </span>
              <span
                className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                / {data?.stats.totalDevicesCount} Registered
              </span>
            </div>
            <p
              className={`text-xs mt-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
            >
              Currently connected to network
            </p>
          </div>

          <div
            className={`border rounded-2xl p-6 shadow-sm transition-all ${
              isDarkMode
                ? "bg-slate-900/60 border-slate-800"
                : "bg-white border-slate-200/80 hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Network Status
              </span>
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "bg-indigo-50 text-indigo-600"
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-500">
                High-Speed Active
              </span>
            </div>
            <p
              className={`text-xs mt-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
            >
              Bandwidth allocation: 100 Mbps Unlimited
            </p>
          </div>
        </div>

        {/* Analytics Chart */}
        <div
          className={`border rounded-2xl p-6 shadow-sm ${
            isDarkMode
              ? "bg-slate-900/60 border-slate-800"
              : "bg-white border-slate-200/80"
          }`}
        >
          <div className="mb-6">
            <h2 className="text-base font-bold">Daily Data Consumption (GB)</h2>
            <p
              className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Interactive session timeline tracking bandwidth usage
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: isDarkMode ? "#1e293b" : "#f1f5f9" }}
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                    borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                    borderRadius: "10px",
                    color: isDarkMode ? "#ffffff" : "#0f172a",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="dataGB"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Devices Control Table */}
        <div
          className={`border rounded-2xl p-6 shadow-sm ${
            isDarkMode
              ? "bg-slate-900/60 border-slate-800"
              : "bg-white border-slate-200/80"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold">
                Registered Devices & MAC Controls
              </h2>
              <p
                className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Manage hardware MAC address whitelist for instant auto-login
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Add New Device
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b text-xs uppercase font-bold ${
                    isDarkMode
                      ? "border-slate-800 text-slate-400 bg-slate-950/40"
                      : "border-slate-200 text-slate-500 bg-slate-50/80"
                  }`}
                >
                  <th className="py-3 px-4">Device Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">MAC Address</th>
                  {/* ADDED COLUMN HEADER */}
                  <th className="py-3 px-4">Registration Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Toggle Connection</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-sm ${
                  isDarkMode ? "divide-slate-800/60" : "divide-slate-100"
                }`}
              >
                {data?.devices.map((device) => (
                  <tr
                    key={device.id}
                    className={`transition-colors ${
                      isDarkMode
                        ? "hover:bg-slate-800/40"
                        : "hover:bg-slate-50/80"
                    }`}
                  >
                    <td className="py-4 px-4 font-semibold flex items-center gap-2.5">
                      {device.deviceType === "Laptop" && (
                        <Laptop className="w-4 h-4 text-blue-500" />
                      )}
                      {device.deviceType === "Mobile" && (
                        <Smartphone className="w-4 h-4 text-indigo-500" />
                      )}
                      {device.deviceType === "Tablet" && (
                        <Tablet className="w-4 h-4 text-emerald-500" />
                      )}
                      {device.deviceName}
                    </td>
                    <td
                      className={`py-4 px-4 text-xs font-medium ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {device.deviceType}
                    </td>
                    <td
                      className={`py-4 px-4 font-mono text-xs font-medium ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {device.macAddress}
                    </td>

                    {/* ADDED REGISTRATION DATE CELL */}
                    <td
                      className={`py-4 px-4 text-xs font-medium ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {device.createdAt
                        ? new Date(device.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "30 Jul 2026, 05:27 PM"}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-bold inline-block ${
                          device.status === "ONLINE"
                            ? isDarkMode
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : isDarkMode
                              ? "bg-slate-800 text-slate-400"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {device.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() =>
                          handleToggleStatus(device.id, device.status)
                        }
                        className={`p-2 rounded-xl transition-colors border ${
                          device.status === "ONLINE"
                            ? isDarkMode
                              ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                              : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                            : isDarkMode
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                        }`}
                        title={
                          device.status === "ONLINE" ? "Disconnect" : "Connect"
                        }
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`border rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl ${
              isDarkMode
                ? "bg-slate-900 border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div>
              <h3 className="text-base font-bold">
                Register New Hardware Device
              </h3>
              <p
                className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Enter device details to whitelist MAC address
              </p>
            </div>

            {addError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl">
                {addError}
              </div>
            )}

            <form onSubmit={handleAddDevice} className="space-y-4">
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  Device Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Work MacBook Air"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 ${
                    isDarkMode
                      ? "bg-slate-950 border-slate-800"
                      : "bg-slate-50 border-slate-200"
                  }`}
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  Device Category
                </label>
                <select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 ${
                    isDarkMode
                      ? "bg-slate-950 border-slate-800"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Tablet">Tablet</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  Hardware MAC Address
                </label>
                <input
                  type="text"
                  placeholder="AA:BB:CC:DD:EE:FF"
                  value={macAddress}
                  onChange={(e) => setMacAddress(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-blue-500 ${
                    isDarkMode
                      ? "bg-slate-950 border-slate-800"
                      : "bg-slate-50 border-slate-200"
                  }`}
                  required
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isDarkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold transition-colors shadow-md shadow-blue-500/20"
                >
                  Save Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
