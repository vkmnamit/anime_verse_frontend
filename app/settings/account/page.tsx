"use client";

import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";

export default function AccountPage() {
    const { user } = useAuth();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div className="w-full max-w-2xl space-y-10 animate-in fade-in duration-500">

            {/* General Section */}
            <section>
                <h2 className="text-[18px] font-semibold text-white mb-4">General</h2>

                <div className="bg-white/[0.02] border border-white/5 rounded-xl flex flex-col">
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[15px] font-medium text-white">Email address</span>
                            <span className="text-[13px] text-white/55 mt-1">The email associated with your account</span>
                        </div>
                        <div className="flex items-center gap-4 cursor-pointer group">
                            <span className="text-[14px] text-white/70">{user?.email || "user@example.com"}</span>
                            <svg className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6">
                        <div className="flex flex-col">
                            <span className="text-[15px] font-medium text-white">Location customization</span>
                            <span className="text-[13px] text-white/55 mt-1">Specify your location for better recommendations</span>
                        </div>
                        <div className="flex items-center gap-4 cursor-pointer group">
                            <span className="text-[14px] text-white/70">Use approximate location</span>
                            <svg className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section>
                <h2 className="text-[18px] font-semibold text-white mb-4">Security</h2>

                <div className="bg-white/[0.02] border border-white/5 rounded-xl flex flex-col">
                    <div className="flex flex-col p-6 border-b border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[15px] font-medium text-white">Password</span>
                                <span className="text-[13px] text-white/55 mt-1">Change your security key</span>
                            </div>
                            <button
                                onClick={() => setIsChangingPassword(!isChangingPassword)}
                                className="px-5 py-2 bg-white/10 hover:bg-white/15 border border-white/5 text-white text-[14px] font-medium rounded-lg transition-colors"
                            >
                                Change Password
                            </button>
                        </div>

                        {isChangingPassword && (
                            <div className="mt-6 pt-5 border-t border-white/5 space-y-4 max-w-sm">
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="Old password"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-[14px] text-white outline-none focus:border-white/30 transition-all placeholder:text-white/30"
                                />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="New password"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-[14px] text-white outline-none focus:border-white/30 transition-all placeholder:text-white/30"
                                />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-[14px] text-white outline-none focus:border-white/30 transition-all placeholder:text-white/30"
                                />
                                <div className="pt-2 flex justify-end">
                                    <button className="px-6 py-2 bg-white text-black hover:bg-[#eaeaea] text-[14px] font-semibold rounded-lg transition-colors shadow-sm">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between p-6">
                        <div className="flex flex-col">
                            <span className="text-[15px] font-medium text-white">Two-factor authentication</span>
                            <span className="text-[13px] text-white/55 mt-1">Help protect your account from unauthorized access</span>
                        </div>
                        <div className="w-10 h-6 bg-white/20 rounded-full relative cursor-pointer border border-white/5 shadow-inner">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Advanced Section */}
            <section>
                <h2 className="text-[18px] font-semibold text-white mb-4">Advanced</h2>

                <div className="bg-white/[0.02] border border-[#ff4545]/20 rounded-xl flex flex-col">
                    <div className="flex items-center justify-between p-6 cursor-pointer group">
                        <div className="flex flex-col">
                            <span className="text-[15px] font-medium text-[#ff4545] group-hover:text-[#ff5c5c] transition-colors">Delete account</span>
                            <span className="text-[13px] text-white/55 mt-1">Permanently remove your account and all its data</span>
                        </div>
                        <svg className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </section>

        </div>
    );
}

