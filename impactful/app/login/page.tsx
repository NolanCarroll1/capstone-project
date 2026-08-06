"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { authenticateAdmin, getAdminAccountName, registerAdminFromInvite } from "@/lib/auth/adminInvites";
import { getActiveSession, getPostLoginHref, setActiveSession } from "@/lib/auth/session";

type AuthMode = "sign-in" | "sign-up";
type LoginPanel = "user" | "admin";
type AdminAuthMode = "sign-in" | "sign-up";

const USER_EMAIL = "user@impactful.org";
const DEMO_PASSWORD = "password";

function normalize(value: string) {
	return value.trim().toLowerCase();
}

function normalizeName(value: string) {
	return value.trim().replace(/\s+/g, " ");
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
						<span className={`absolute inset-x-0 -bottom-px h-[2px] ${active ? "bg-black" : "bg-transparent"}`} />
					</button>
				);
			})}
		</div>
	);
}

function PanelToggle({ panel, onChange }: { panel: LoginPanel; onChange: (panel: LoginPanel) => void }) {
	return (
		<div className="mt-4 grid h-[44px] grid-cols-2 rounded-[1000px] border-[1.8px] border-[#e5e7eb] bg-white p-1">
			<button
				type="button"
				onClick={() => onChange("user")}
				className={`rounded-[1000px] font-mono text-[12px] font-bold uppercase tracking-[0.12em] ${
					panel === "user" ? "bg-black text-white" : "text-[#6a7282]"
				}`}
			>
				User
			</button>
			<button
				type="button"
				onClick={() => onChange("admin")}
				className={`rounded-[1000px] font-mono text-[12px] font-bold uppercase tracking-[0.12em] ${
					panel === "admin" ? "bg-black text-white" : "text-[#6a7282]"
				}`}
			>
				Admin
			</button>
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
			<span className="mb-[6px] block font-mono text-[12px] font-bold uppercase tracking-[1.2px] text-[#99a1af]">{label}</span>
			<input
				type={type}
				value={value}
				onChange={onChange ? (event) => onChange(event.target.value) : undefined}
				placeholder={placeholder}
				className="h-[48px] w-full rounded-[14px] border-[1.827px] border-[#e5e7eb] bg-white px-[18px] font-sans text-[14px] text-black outline-none transition-colors placeholder:text-[rgba(10,10,10,0.5)] focus:border-black"
			/>
		</label>
	);
}

function WelcomeMascot() {
	return (
		<div className="relative h-[100px] w-[93px] overflow-hidden" aria-hidden>
			<Image
				src="/assets/welcome-logo-node-686-16004-latest.png"
				alt=""
				width={711}
				height={441}
				unoptimized
				className="pointer-events-none absolute max-w-none select-none"
				style={{
					height: "441.38%",
					width: "711.11%",
					left: "-19.91%",
					top: "-100%",
				}}
			/>
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
	const [adminFullName, setAdminFullName] = useState("");
	const [adminError, setAdminError] = useState("");
	const [adminNotice, setAdminNotice] = useState("");

	const isAdminPanel = panel === "admin";
	const resolvedMode: AuthMode = isAdminPanel ? adminMode : mode;
	const isSignUp = resolvedMode === "sign-up";
	const normalizedUserName = normalizeName(fullName);
	const normalizedAdminName = normalizeName(adminFullName);

	useEffect(() => {
		const session = getActiveSession();
		if (session) {
			router.replace(getPostLoginHref(session));
		}
	}, [router]);

	const handleUserSubmit = () => {
		if (mode === "sign-up") {
			if (!normalizedUserName || normalizedUserName.split(" ").length < 2) {
				setUserError("Enter first and last name.");
				return;
			}
			if (!normalize(email) || !password.trim()) {
				setUserError("Enter your email and password.");
				return;
			}
			setUserError("");
			setActiveSession("user", email, normalizedUserName);
			router.push("/dashboard");
			return;
		}

		if (normalize(email) !== USER_EMAIL || password !== DEMO_PASSWORD) {
			setUserError("Use user@impactful.org with password 'password' for user login.");
			return;
		}

		setUserError("");
		setActiveSession("user", email, normalizedUserName || "User Impactful");
		router.push("/dashboard");
	};

	const handleAdminSubmit = () => {
		if (adminMode === "sign-in") {
			if (!authenticateAdmin(adminEmail, adminPassword)) {
				setAdminNotice("");
				setAdminError("Invalid credentials. Use an invited admin account or create one with your invite code.");
				return;
			}

			setAdminError("");
			setAdminNotice("");
			setActiveSession("admin", adminEmail, getAdminAccountName(adminEmail));
			router.push("/admin");
			return;
		}

		if (!normalizedAdminName || normalizedAdminName.split(" ").length < 2) {
			setAdminNotice("");
			setAdminError("Enter first and last name.");
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
			fullName: normalizedAdminName,
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
		setActiveSession("admin", adminEmail, normalizedAdminName);
		router.push("/admin");
	};

	const heading = isSignUp ? "Create account" : "Welcome back";
	const subtitle = isSignUp ? "Join the Digital Citizen program." : "Sign in to continue your journey.";

	return (
		<main className="min-h-screen bg-white text-black">
			<section className="mx-auto flex min-h-screen w-full max-w-[393px] flex-col px-8 pb-10 pt-14">
				<Link href="/welcome" className="w-fit font-mono text-[14px] font-medium leading-5 text-[#99a1af]">
					← BACK
				</Link>

				<div className="pt-6">
					<WelcomeMascot />
				</div>

				<h1 className="pt-6 font-sans text-[30px] font-bold leading-9 text-black">{heading}</h1>
				<p className="pt-1 font-sans text-[14px] leading-5 text-[#99a1af]">{subtitle}</p>

				<PanelToggle
					panel={panel}
					onChange={(next) => {
						setPanel(next);
						setUserError("");
						setAdminError("");
						setAdminNotice("");
					}}
				/>

				<div className="pt-6">
					<AuthTabs
						mode={resolvedMode}
						onModeChange={(next) => {
							if (isAdminPanel) {
								setAdminMode(next as AdminAuthMode);
								setAdminError("");
								setAdminNotice("");
							} else {
								setMode(next);
								setUserError("");
							}
						}}
					/>
				</div>

				<div className="space-y-4 pt-6">
					{isAdminPanel ? (
						<>
							{isSignUp ? <InputField label="FULL NAME" placeholder="Jane Smith" value={adminFullName} onChange={setAdminFullName} /> : null}
							<InputField label="EMAIL" placeholder="admin@impactful.org" value={adminEmail} onChange={setAdminEmail} />
							{isSignUp ? <InputField label="INVITE CODE" placeholder="AB12CD34" value={adminInviteCode} onChange={setAdminInviteCode} /> : null}
							<InputField label="PASSWORD" placeholder="••••••••" type="password" value={adminPassword} onChange={setAdminPassword} />
							{isSignUp ? (
								<InputField
									label="CONFIRM PASSWORD"
									placeholder="••••••••"
									type="password"
									value={adminConfirmPassword}
									onChange={setAdminConfirmPassword}
								/>
							) : null}
						</>
					) : (
						<>
							{isSignUp ? <InputField label="FULL NAME" placeholder="Jane Smith" value={fullName} onChange={setFullName} /> : null}
							<InputField label="EMAIL" placeholder="you@uvu.edu" value={email} onChange={setEmail} />
							<InputField label="PASSWORD" placeholder="••••••••" type="password" value={password} onChange={setPassword} />
						</>
					)}
				</div>

				{isAdminPanel ? (
					<>
						{adminMode === "sign-up" ? <p className="pt-2 text-xs text-[#77839a]">Use the invite code shared by an existing admin.</p> : null}
						{adminError ? <p className="pt-3 text-sm text-[#b42318]">{adminError}</p> : null}
						{adminNotice ? <p className="pt-3 text-sm text-[#0f5047]">{adminNotice}</p> : null}
					</>
				) : (
					<>
						{userError ? <p className="pt-3 text-sm text-[#b42318]">{userError}</p> : null}
						{!isSignUp ? (
							<div className="pt-2 text-right">
								<a href="#forgot" className="font-sans text-[12px] text-[#99a1af] underline underline-offset-2">
									Forgot password?
								</a>
							</div>
						) : null}
					</>
				)}

				<button
					type="button"
					onClick={isAdminPanel ? handleAdminSubmit : handleUserSubmit}
					className="mt-6 h-[56px] w-full rounded-[1000px] bg-[#ff8d00] font-sans text-[16px] font-bold text-white shadow-[0px_4px_0px_#b46300]"
				>
					{isAdminPanel
						? isSignUp
							? "Create Admin Account →"
							: "Sign In as Admin →"
						: isSignUp
							? "Create Account →"
							: "Sign In →"}
				</button>

				<div className="mt-auto pt-6 text-center font-sans text-[14px] leading-5 text-[#99a1af]">
					{isSignUp ? "Already have an account? " : "Don’t have an account? "}
					<button
						type="button"
						onClick={() => {
							if (isAdminPanel) {
								setAdminMode(isSignUp ? "sign-in" : "sign-up");
							} else {
								setMode(isSignUp ? "sign-in" : "sign-up");
							}
						}}
						className="font-bold text-[#ff8d00] underline underline-offset-2"
					>
						{isSignUp ? "Sign in" : "Sign up"}
					</button>
				</div>
			</section>
		</main>
	);
}
