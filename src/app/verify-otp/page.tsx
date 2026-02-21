"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

function VerifyOTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            toast.error("Invalid verification link");
            router.push("/signup");
        }
    }, [email, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error("Please enter a 6-digit code");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Verification failed");
            } else {
                toast.success("Email verified! You can now sign in.");
                router.push("/login");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Verify Your Email</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                        We've sent a 6-digit code to <span className="font-semibold text-neutral-900 dark:text-white">{email}</span>
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6"
                >
                    <div>
                        <label className="block text-sm font-medium mb-3 text-center">Enter Verification Code</label>
                        <input
                            type="text"
                            maxLength={6}
                            required
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            className="w-full text-center text-3xl tracking-[1.5rem] font-mono py-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
                    Didn't receive the code?{" "}
                    <button
                        onClick={() => toast.info("Please check your spam folder or try registering again.")}
                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                        Resend Code
                    </button>
                </p>
            </div>
        </div>
    );
}

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerifyOTPContent />
        </Suspense>
    );
}
