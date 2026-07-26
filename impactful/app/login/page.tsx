"use client";

import Link from "next/link";
import { useState } from "react";

type AuthMode = "sign-in" | "sign-up";

function AuthTabs({ mode, onModeChange }: { mode: AuthMode; onModeChange: (mode: AuthMode) => void }) {
	return (
		<div className="grid grid-cols-2 border-b border-[#e5e7eb] text-center">
			{(["sign-in", "sign-up"] as const).map((tab) => {
				const active = mode === tab;
				return (
					<button
						key={tab}
						type="button"
						onClick={() => onModeChange(tab)}
						className={`relative pb-4 font-sans text-[clamp(12px,3.2vw,14px)] font-semibold uppercase tracking-[0.08em] ${
							active ? "text-black" : "text-[#9ea7b8]"
						}`}
					>
						{tab === "sign-in" ? "SIGN IN" : "SIGN UP"}
						<span
							className={`absolute inset-x-0 -bottom-px h-0.5 ${active ? "bg-black" : "bg-transparent"}`}
						/>
					</button>
				);
			})}
		</div>
	);
}

function InputField({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
	return (
		<label className="block">
			<span className="mb-2 block font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-[#6f7890]">
				{label}
			</span>
			<input
				type={type}
				placeholder={placeholder}
				className="h-12 w-full rounded-xl border border-[#dfe4ea] bg-white px-4 font-sans text-[14px] text-black outline-none transition-colors placeholder:text-[#9aa3b2] focus:border-black"
			/>
		</label>
	);
}

function LoginHero() {
	return (
		<div className="bg-black px-10 pb-12 pt-12 text-white">
			<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8f98aa]">
				IMPACTFUL
			</p>
			<h1 className="mt-12 max-w-[10.2em] font-sans text-[clamp(32px,8.4vw,48px)] font-bold leading-[0.92] tracking-[-0.06em] text-white">
				Train.
				<br />
				<span className="text-[#8b98b0]">Lead.</span>
				<br />
				Impact.
			</h1>
			<p className="mt-6 max-w-[20rem] font-sans text-[clamp(14px,3.6vw,16px)] leading-[1.45] tracking-[-0.02em] text-[#7f8798]">
				An experiential learning platform for the next generation of ethical leaders.
			</p>
			<p className="mt-6 font-sans text-[12px] text-[#5e6676]">
				UVU Center for Social Impact
			</p>
		</div>
	);
}

export default function LoginPage() {
	const [mode, setMode] = useState<AuthMode>("sign-up");
	const isSignUp = mode === "sign-up";

	return (
		<main className="fixed inset-0 overflow-hidden bg-[#f3f1ec] text-black">
			<section className="flex min-h-dvh w-full flex-col overflow-hidden bg-white">
				<div className="flex-[0.58] min-h-0 overflow-hidden lg:flex-[0.56]">
					<LoginHero />
				</div>

				<div className="flex flex-[0.42] min-h-0 flex-col overflow-hidden bg-white px-8 py-8 lg:flex-[0.44] lg:px-8 lg:py-8">
					<div className="max-w-105 flex-1 overflow-hidden">
						<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#a0a8b7]">
							WELCOME
						</p>
						<h2 className="mt-3 max-w-[10.5em] font-sans text-[clamp(24px,6vw,30px)] font-bold leading-[0.98] tracking-[-0.04em] text-black lg:text-[clamp(30px,4vw,40px)]">
							{isSignUp ? "Create your account" : "Sign in to your account"}
						</h2>

						<div className="mt-8">
							<AuthTabs mode={mode} onModeChange={setMode} />
						</div>

						<div className="mt-8 space-y-4">
							{isSignUp ? <InputField label="Full Name" placeholder="Jane Smith" /> : null}
							<InputField label="Email" placeholder="you@uvu.edu" />
							<InputField label="Password" placeholder="••••••••" type="password" />
						</div>

						<div className="mt-4 flex justify-end">
							<a href="#forgot" className="font-sans text-[12px] text-[#77839a] underline underline-offset-2">
								Forgot password?
							</a>
						</div>

						<Link
							href="/dashboard"
							className="mt-8 flex h-12 items-center justify-center bg-black font-mono text-[clamp(14px,3.4vw,16px)] font-bold tracking-[0.18em] text-white"
						>
							{isSignUp ? "[ CREATE ACCOUNT ]" : "[ SIGN IN ]"}
						</Link>

						<p className="mt-6 text-center font-sans text-[clamp(11px,3vw,12px)] text-[#99a1af]">
							{isSignUp ? (
								<>
									Already have an account?{" "}
									<button
										type="button"
										onClick={() => setMode("sign-in")}
										className="font-semibold text-black underline underline-offset-2"
									>
										Sign in
									</button>
								</>
							) : (
								<>
									Don&apos;t have an account?{" "}
									<button
										type="button"
										onClick={() => setMode("sign-up")}
										className="font-semibold text-black underline underline-offset-2"
									>
										Sign up
									</button>
								</>
							)}
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}