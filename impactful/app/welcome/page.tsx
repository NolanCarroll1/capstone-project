"use client";

import Image from "next/image";
import { useState } from "react";

type AuthMode = "sign-in" | "sign-up";

function AuthTabs({ mode, onModeChange }: { mode: AuthMode; onModeChange: (mode: AuthMode) => void }) {
	return (
		<div className="grid grid-cols-2 border-b border-[#e5e8ef] text-center">
			<button
				type="button"
				onClick={() => onModeChange("sign-in")}
				className={`relative pb-4 font-sans text-[14px] font-semibold uppercase tracking-[0.08em] ${
					mode === "sign-in" ? "text-black" : "text-[#9ea7b8]"
				}`}
			>
				SIGN IN
				<span
					className={`absolute inset-x-0 -bottom-px h-[2px] ${mode === "sign-in" ? "bg-black" : "bg-transparent"}`}
				/>
			</button>
			<button
				type="button"
				onClick={() => onModeChange("sign-up")}
				className={`relative pb-4 font-sans text-[14px] font-semibold uppercase tracking-[0.08em] ${
					mode === "sign-up" ? "text-black" : "text-[#9ea7b8]"
				}`}
			>
				SIGN UP
				<span
					className={`absolute inset-x-0 -bottom-px h-[2px] ${mode === "sign-up" ? "bg-black" : "bg-transparent"}`}
				/>
			</button>
		</div>
	);
}

function WelcomeHero() {
	return (
		<>
			<div className="bg-black px-6 pb-8 pt-8 text-white lg:hidden">
			<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8f98aa]">
				IMPACTFUL
			</p>
			<h1 className="mt-10 max-w-[260px] font-sans text-[60px] font-bold leading-[0.95] tracking-[-0.06em] text-white sm:text-[58px]">
				Train.
				<br />
				<span className="text-[#8b98b0]">Lead.</span>
				<br />
				Impact.
			</h1>
			<p className="mt-8 max-w-[300px] font-sans text-[18px] leading-[1.5] tracking-[-0.02em] text-[#7f8798]">
				An experiential learning platform for the next generation of ethical leaders.
			</p>
			<p className="mt-12 font-sans text-[13px] text-[#5e6676]">UVU Center for Social Impact</p>
			</div>

			<div className="hidden lg:flex lg:h-full lg:flex-col lg:items-center lg:justify-center lg:bg-[#07384b] lg:px-10 lg:py-10">
				<div className="flex h-[220px] w-[220px] items-center justify-center">
					<Image
						src="http://localhost:3845/assets/14bf75ea86aa01748aa388c99139a23bf8093ea4.png"
						alt="Impactful town illustration"
						width={220}
						height={220}
						priority
						className="h-full w-full object-contain"
					/>
				</div>

				<p className="mt-8 font-sans text-[24px] font-semibold uppercase tracking-[0.18em] text-[#ffb42f]">
					IMPACTFUL
				</p>
				<p className="mt-3 font-sans text-[14px] font-semibold uppercase tracking-[0.14em] text-[#ffca5b]">
					Deceptive Design module
				</p>
			</div>
		</>
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
				className="h-14 w-full rounded-[12px] border border-[#dfe4ea] bg-white px-4 font-sans text-[14px] text-black outline-none transition-colors placeholder:text-[#9aa3b2] focus:border-black"
			/>
		</label>
	);
}

export default function WelcomePage() {
	const [mode, setMode] = useState<AuthMode>("sign-in");

	return (
		<main className="min-h-screen bg-[#f3f1ec] px-0 py-0 text-black sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-6">
			<section className="w-full max-w-[393px] overflow-hidden bg-white shadow-[0_20px_80px_rgba(0,0,0,0.12)] sm:rounded-[24px] lg:flex lg:max-w-[1024px] lg:min-h-[768px] lg:overflow-hidden lg:rounded-none lg:bg-white lg:shadow-none">
				<div className="lg:w-[40%] lg:min-w-[404px]">
					<WelcomeHero />
				</div>

				<div className="bg-white px-6 pb-8 pt-8 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-16 lg:py-16">
					<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#a0a8b7]">
						WELCOME
					</p>
					<h2 className="mt-3 max-w-[360px] font-sans text-[32px] font-bold leading-[1.05] tracking-[-0.04em] text-black lg:text-[40px]">
						{mode === "sign-in" ? "Sign in to your account" : "Create your account"}
					</h2>

					<div className="mt-8">
						<AuthTabs mode={mode} onModeChange={setMode} />
					</div>

					<div className="mt-8 space-y-4 lg:max-w-[420px]">
						{mode === "sign-up" ? <InputField label="Full Name" placeholder="Jane Smith" /> : null}
						<InputField label="Email" placeholder="you@uvu.edu" />
						<InputField label="Password" placeholder="••••••••" type="password" />
					</div>

					<div className="mt-4 flex justify-end">
						<a href="#forgot" className="font-sans text-[13px] text-[#77839a] underline underline-offset-2">
							Forgot password?
						</a>
					</div>

					<a
						href={mode === "sign-in" ? "/game" : "/tutorial"}
						className="mt-8 flex h-[52px] items-center justify-center bg-black font-mono text-[16px] font-bold tracking-[0.18em] text-white transition-colors hover:bg-[#111827] lg:max-w-[420px]"
					>
						{mode === "sign-in" ? "[ SIGN IN ]" : "[ CREATE ACCOUNT ]"}
					</a>

					<p className="mt-8 text-center font-sans text-[14px] text-[#9aa3b2]">
						{mode === "sign-in" ? (
							<>
								Don&apos;t have an account? <a href="#sign-up" className="font-semibold text-black underline underline-offset-2">Sign up</a>
							</>
						) : (
							<>
								Already have an account? <a href="#sign-in" className="font-semibold text-black underline underline-offset-2">Sign in</a>
							</>
						)}
					</p>
				</div>
			</section>
		</main>
	);
}
