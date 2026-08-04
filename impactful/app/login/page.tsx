"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { authenticateAdmin, registerAdminFromInvite } from "@/lib/auth/adminInvites";
import { getActiveSession, getPostLoginHref, setActiveSession } from "@/lib/auth/session";

type AuthMode = "sign-in" | "sign-up";
type LoginPanel = "user" | "admin";
type AdminAuthMode = "sign-in" | "sign-up";

const USER_EMAIL = "user@impactful.org";
const DEMO_PASSWORD = "password";

function normalize(value: string) {
	return value.trim().toLowerCase();
}

function AuthTabs({ mode, onModeChange }: { mode: AuthMode; onModeChange: (mode: AuthMode) => void }) {
	return (
		<div className="grid h-[46px] grid-cols-2 border-b border-[#e5e7eb] text-center">
			{(["sign-in", "sign-up"] as const).map((tab) => {
				const active = mode === tab;
				return (
					<button
						key={tab}
						type="button"
						onClick={() => onModeChange(tab)}
						className={`relative flex h-full items-center justify-center pb-[14px] pt-3 font-sans text-[14px] font-semibold uppercase tracking-[0.025em] ${
							active ? "text-black" : "text-[#9ea7b8]"
						}`}
					>
						{tab === "sign-in" ? "SIGN IN" : "SIGN UP"}
						<span
							className={`absolute inset-x-0 -bottom-px h-[2px] ${active ? "bg-black" : "bg-transparent"}`}
						/>
					</button>
				);
			})}
		</div>
	);
}

function InputField({
	label,
	placeholder,
	type = "text",
	value,
	onChange,
}: {
	label: string;
	placeholder: string;
	type?: string;
	value?: string;
	onChange?: (value: string) => void;
}) {
	return (
		<label className="block">
			<span className="mb-2 block font-sans text-[12px] font-bold uppercase tracking-[0.1em] text-[#6a7282]">
				{label}
			</span>
			<input
				type={type}
				value={value}
				onChange={onChange ? (event) => onChange(event.target.value) : undefined}
				placeholder={placeholder}
				className="h-12 w-full rounded-[10px] border-[1.8px] border-[#e5e7eb] bg-white px-[18px] font-sans text-[14px] text-black outline-none transition-colors placeholder:text-[rgba(10,10,10,0.5)] focus:border-black"
			/>
		</label>
	);
}

function LoginHero() {
	return (
		<div className="flex min-h-[40svh] flex-col justify-between bg-black px-[clamp(24px,8vw,40px)] py-[clamp(32px,8vw,48px)] text-white lg:min-h-screen lg:px-12 lg:py-12">
			<div>
				<p className="font-sans text-[12px] font-bold uppercase tracking-[0.1em] text-[#99a1af]">
					IMPACTFUL
				</p>
				<h1 className="mt-3 font-sans text-[clamp(34px,12vw,48px)] font-bold leading-[1.05] tracking-[-0.04em] text-white">
					Train.
					<br />
					<span className="text-[#8b98b0]">Lead.</span>
					<br />
					Impact.
				</h1>
				<p className="mt-6 max-w-[32rem] font-sans text-[clamp(14px,3.8vw,16px)] leading-relaxed tracking-[-0.01em] text-[#99a1af]">
					An experiential learning platform for the next generation of ethical leaders.
				</p>
			</div>
		</div>
	);
}

export default function LoginPage() {
	const router = useRouter();
	const [panel, setPanel] = useState<LoginPanel>("user");
	const [mode, setMode] = useState<AuthMode>("sign-in");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [userError, setUserError] = useState("");
	const [adminMode, setAdminMode] = useState<AdminAuthMode>("sign-in");
	const [adminEmail, setAdminEmail] = useState("");
	const [adminPassword, setAdminPassword] = useState("");
	const [adminInviteCode, setAdminInviteCode] = useState("");
	const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
	const [adminError, setAdminError] = useState("");
	const [adminNotice, setAdminNotice] = useState("");
	const isSignUp = mode === "sign-up";
	const isAdminPanel = panel === "admin";

	useEffect(() => {
		const session = getActiveSession();
		if (session) {
			router.replace(getPostLoginHref(session));
		}
	}, [router]);

	const handleUserLogin = () => {
		if (normalize(email) !== USER_EMAIL || password !== DEMO_PASSWORD) {
			setUserError("Use user@impactful.org with password 'password' for user login.");
			return;
		}

		setUserError("");
		setActiveSession("user");
		router.push("/dashboard");
	};

	const handleAdminLogin = () => {
		if (adminMode === "sign-in") {
			if (!authenticateAdmin(adminEmail, adminPassword)) {
				setAdminNotice("");
				setAdminError("Invalid credentials. Use an invited admin account or create one with your invite code.");
				return;
			}

			setAdminError("");
			setAdminNotice("");
			setActiveSession("admin");
			router.push("/admin");
			return;
		}

		if (adminPassword !== adminConfirmPassword) {
			setAdminNotice("");
			setAdminError("Passwords do not match.");
			return;
		}

		const result = registerAdminFromInvite({
			email: adminEmail,
			code: adminInviteCode,
			password: adminPassword,
		});

		if (!result.ok) {
			setAdminNotice("");
			setAdminError(result.message);
			return;
		}

		setAdminError("");
		setAdminNotice(result.message);
		setAdminInviteCode("");
		setAdminConfirmPassword("");
		setActiveSession("admin");
		router.push("/admin");
	};

	return (
		<main className="min-h-screen w-screen overflow-x-hidden bg-white text-black">
			<section className="w-screen bg-white lg:grid lg:min-h-screen lg:grid-cols-[minmax(340px,0.95fr)_minmax(0,1.05fr)]">
				<div className="shrink-0 border-b border-[#1d232f] lg:min-h-0 lg:border-b-0">
					<LoginHero />
				</div>

				<div className="flex flex-1 flex-col bg-white px-8 py-8 lg:px-12 lg:py-12 xl:px-16 xl:py-16">
					<div className="max-w-[560px] flex-1">
						<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#a0a8b7]">
							{isAdminPanel ? "ADMIN ACCESS" : "WELCOME"}
						</p>
						<h2 className="mt-3 font-sans text-[30px] font-bold leading-[1.2] tracking-[-0.02em] text-black lg:max-w-[10.5em]">
							{isAdminPanel ? (adminMode === "sign-in" ? "Sign in to admin console" : "Create your admin account") : isSignUp ? "Create your account" : "Sign in to your account"}
						</h2>

						<div className="mt-3 flex items-center justify-between rounded-[10px] border border-[#e5e7eb] bg-white p-1">
							<button
								type="button"
								onClick={() => setPanel("user")}
								className={`flex h-9 flex-1 items-center justify-center rounded-[8px] font-sans text-[12px] font-semibold uppercase tracking-[0.12em] ${
									panel === "user" ? "bg-black text-white" : "text-[#4f5f78]"
								}`}
							>
								User Login
							</button>
							<button
								type="button"
								onClick={() => setPanel("admin")}
								className={`flex h-9 flex-1 items-center justify-center rounded-[8px] font-sans text-[12px] font-semibold uppercase tracking-[0.12em] ${
									panel === "admin" ? "bg-black text-white" : "text-[#4f5f78]"
								}`}
							>
								Admin Login
							</button>
						</div>

						{!isAdminPanel ? (
							<>
								<div className="mt-6">
									<AuthTabs mode={mode} onModeChange={setMode} />
								</div>

								<div className="mt-6 space-y-4">
									{isSignUp ? <InputField label="Full Name" placeholder="Jane Smith" value={fullName} onChange={setFullName} /> : null}
									<InputField label="Email" placeholder="you@uvu.edu" value={email} onChange={setEmail} />
									<InputField label="Password" placeholder="••••••••" type="password" value={password} onChange={setPassword} />
								</div>

								{userError ? <p className="mt-3 text-sm text-[#b42318]">{userError}</p> : null}

								<div className={`mt-1 flex justify-end ${isSignUp ? "invisible" : "visible"}`}>
									<a href="#forgot" className="font-sans text-[12px] text-[#77839a] underline underline-offset-2">
										Forgot password?
									</a>
								</div>

								<button
									type="button"
									onClick={handleUserLogin}
									className="mt-3 flex h-14 w-full items-center justify-center bg-black font-mono text-[16px] font-bold tracking-[0.1em] text-white"
								>
									{isSignUp ? "[ CREATE ACCOUNT ]" : "[ SIGN IN ]"}
								</button>

								<p className="mt-8 text-center font-sans text-[12px] text-[#99a1af]">
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
							</>
						) : (
							<>
								<div className="mt-6" onClick={() => { setAdminError(""); setAdminNotice(""); }}>
									<AuthTabs mode={adminMode} onModeChange={(next) => setAdminMode(next as AdminAuthMode)} />
								</div>

								<div className="mt-6 space-y-4">
									<InputField label="Admin Email" placeholder="admin@impactful.org" value={adminEmail} onChange={setAdminEmail} />
									{adminMode === "sign-up" ? <InputField label="Invite Code" placeholder="AB12CD34" value={adminInviteCode} onChange={setAdminInviteCode} /> : null}
									<InputField label="Password" placeholder="••••••••" type="password" value={adminPassword} onChange={setAdminPassword} />
									{adminMode === "sign-up" ? <InputField label="Confirm Password" placeholder="••••••••" type="password" value={adminConfirmPassword} onChange={setAdminConfirmPassword} /> : null}
								</div>

								{adminMode === "sign-up" ? (
									<p className="mt-2 text-xs text-[#77839a]">Use the invite code shared by an existing admin.</p>
								) : null}

								{adminError ? <p className="mt-3 text-sm text-[#b42318]">{adminError}</p> : null}
								{adminNotice ? <p className="mt-3 text-sm text-[#0f5047]">{adminNotice}</p> : null}

								<button
									type="button"
									onClick={handleAdminLogin}
									className="mt-3 flex h-14 w-full items-center justify-center bg-black font-mono text-[16px] font-bold tracking-[0.1em] text-white"
								>
									{adminMode === "sign-in" ? "[ ADMIN LOGIN ]" : "[ CREATE ADMIN ACCOUNT ]"}
								</button>

								<p className="mt-8 text-center font-sans text-[12px] text-[#99a1af]">
									Need user access?{" "}
									<button
										type="button"
										onClick={() => setPanel("user")}
										className="font-semibold text-black underline underline-offset-2"
									>
										Switch to user login
									</button>
								</p>
							</>
						)}

					</div>
				</div>
			</section>
		</main>
	);
}