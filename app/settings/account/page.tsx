"use client";

import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";

export default function AccountPage() {
    const { user } = useAuth();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div className="max-w-3xl animate-in fade-in duration-500 space-y-12">

            {/* Email Section */}
            <div className="space-y-6">
                <div className="flex flex-col gap-5">
                    <label className="text-[14px] font-bold text-white tracking-wide">Email</label>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-full px-6 py-3.5 text-[14px] text-white/80 focus-within:border-[#e63030]/30 transition-all">
                            {user?.email || "user@example.com"}
                        </div>
                        <div className="px-5 py-2.5 bg-[#0e2a15] text-[#4ade80] text-[12px] font-bold rounded-full border border-[#4ade80]/10 flex items-center justify-center">
                            Verified
                        </div>
                    </div>
                </div>
                <button className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-white text-[13px] font-bold rounded-full transition-all active:scale-95 border border-white/[0.05]">
                    Change Email
                </button>
            </div>

            <div className="h-[1px] w-full bg-white/[0.04]" />

            {/* Password Section */}
            <div className="space-y-8">
                <h3 className="text-[14px] font-bold text-white tracking-wide">Change Password</h3>
                <div className="space-y-4 max-w-lg">
                    <div className="relative group">
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter old password"
                            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-full px-6 py-3.5 text-[13px] text-white outline-none focus:border-[#e63030]/30 transition-all placeholder:text-white/20"
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity">👁️</div>
                    </div>
                    <div className="relative group">
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-full px-6 py-3.5 text-[13px] text-white outline-none focus:border-[#e63030]/30 transition-all placeholder:text-white/20"
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity">👁️</div>
                    </div>
                    <div className="relative group">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-full px-6 py-3.5 text-[13px] text-white outline-none focus:border-[#e63030]/30 transition-all placeholder:text-white/20"
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity">👁️</div>
                    </div>
                </div>
                <button className="px-10 py-3 bg-white/[0.06] hover:bg-white/[0.1] text-white/30 hover:text-white text-[13px] font-bold rounded-full transition-all active:scale-95 border border-white/[0.05]">
                    Save
                </button>
            </div>

            <div className="h-[1px] w-full bg-white/[0.04]" />

            {/* Danger Zone */}
            <div className="space-y-6">
                <h3 className="text-xl font-black text-[#e63030] tracking-tight">Danger Zone</h3>
                <div className="space-y-4">
                    <h4 className="text-[15px] font-bold text-white">Delete Account</h4>
                    <p className="text-white/40 text-[13px] font-medium leading-relaxed">
                        Delete your account and all its associated data.
                    </p>
                    <button className="flex items-center gap-3 px-6 py-3.5 bg-[#e63030] hover:bg-[#ff3b3b] text-white text-[13px] font-bold rounded-full transition-all active:scale-95 shadow-lg shadow-red-950/20">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Account
                    </button>
                </div>
            </div>

        </div>
    );
}
