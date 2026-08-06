"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { clearActiveSession, getPostLoginHref, refreshSessionSnapshot } from "@/lib/auth/session";

type AuthMode = "sign-in" | "sign-up";
type LoginPanel = "user" | "admin";
type AdminAuthMode = "sign-in" | "sign-up";

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
	const [userNotice, setUserNotice] = useState("");
	const [adminMode, setAdminMode] = useState<AdminAuthMode>("sign-in");
	const [adminEmail, setAdminEmail] = useState("");
	const [adminPassword, setAdminPassword] = useState("");
	const [adminInviteCode, setAdminInviteCode] = useState("");
	const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
	const [adminFullName, setAdminFullName] = useState("");
	const [adminError, setAdminError] = useState("");
	const [adminNotice, setAdminNotice] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isAdminPanel = panel === "admin";
	const resolvedMode: AuthMode = isAdminPanel ? adminMode : mode;
	const isSignUp = resolvedMode === "sign-up";
	const normalizedUserName = normalizeName(fullName);
	const normalizedAdminName = normalizeName(adminFullName);

	useEffect(() => {
		let cancelled = false;
		void refreshSessionSnapshot().then((session) => {
			if (!cancelled && session) {
				router.replace(getPostLoginHref(session));
			}
		});
		return () => {
			cancelled = true;
		};
	}, [router]);

	const handleUserSubmit = async () => {
		const supabase = getSupabaseBrowserClient();

		if (mode === "sign-up") {
			if (!normalizedUserName || normalizedUserName.split(" ").length < 2) {
				setUserNotice("");
				setUserError("Enter first and last name.");
				return;
			}
			if (!normalize(email) || !password.trim()) {
				setUserNotice("");
				setUserError("Enter your email and password.");
				return;
			}

			setIsSubmitting(true);
			setUserError("");
			setUserNotice("");
			const { data, error } = await supabase.auth.signUp({
				email: normalize(email),
				password,
				options: {
					data: {
						full_name: normalizedUserName,
						role: "user",
					},
				},
			});
			setIsSubmitting(false);
			if (error) {
				setUserNotice("");
				setUserError(error.message);
				return;
			}

			if (!data.session) {
				setUserError("");
				setUserNotice("Account created. Check your email to confirm, then sign in.");
				setMode("sign-in");
				return;
			}

			const session = await refreshSessionSnapshot();
			router.push(getPostLoginHref(session));
			return;
		}

		if (!normalize(email) || !password.trim()) {
			setUserNotice("");
			setUserError("Enter your email and password.");
			return;
		}

		setIsSubmitting(true);
		setUserError("");
		setUserNotice("");
		const { error } = await supabase.auth.signInWithPassword({
			email: normalize(email),
			password,
		});
		setIsSubmitting(false);
		if (error) {
			setUserNotice("");
			setUserError(error.message);
			return;
		}

		const session = await refreshSessionSnapshot();
		router.push(getPostLoginHref(session));
	};

	const handleAdminSubmit = async () => {
		const supabase = getSupabaseBrowserClient();

		if (adminMode === "sign-in") {
			if (!normalize(adminEmail) || !adminPassword.trim()) {
				setAdminNotice("");
				setAdminError("Enter your email and password.");
				return;
			}

			setIsSubmitting(true);
			const { error } = await supabase.auth.signInWithPassword({
				email: normalize(adminEmail),
				password: adminPassword,
			});
			setIsSubmitting(false);
			if (error) {
				setAdminNotice("");
				setAdminError(error.message);
				return;
			}

			const session = await refreshSessionSnapshot();
			if (session?.role !== "admin") {
				await clearActiveSession();
				setAdminNotice("");
				setAdminError("This account is not an admin account.");
				return;
			}

			setAdminError("");
			setAdminNotice("");
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

		if (!adminInviteCode.trim()) {
			setAdminNotice("");
			setAdminError("Invite code is required.");
			return;
		}

		setIsSubmitting(true);
		const { data, error } = await supabase.auth.signUp({
			email: normalize(adminEmail),
			password: adminPassword,
			options: {
				data: {
					full_name: normalizedAdminName,
					role: "admin",
					invite_code: adminInviteCode.trim().toUpperCase(),
				},
			},
		});
		setIsSubmitting(false);
		if (error) {
			setAdminNotice("");
			setAdminError(error.message);
			return;
		}

		if (!data.session) {
			setAdminError("");
			setAdminNotice("Admin account created. Check your email to confirm, then sign in.");
			setAdminInviteCode("");
			setAdminConfirmPassword("");
			setAdminMode("sign-in");
			return;
		}

		const session = await refreshSessionSnapshot();
		if (session?.role !== "admin") {
			await clearActiveSession();
			setAdminNotice("");
			setAdminError("This account is not an admin account.");
			return;
		}

		setAdminError("");
		setAdminNotice("Admin account created.");
		setAdminInviteCode("");
		setAdminConfirmPassword("");
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
						setUserNotice("");
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
								setUserNotice("");
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
						{userNotice ? <p className="pt-3 text-sm text-[#0f5047]">{userNotice}</p> : null}
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
					disabled={isSubmitting}
					className="mt-6 h-[56px] w-full rounded-[1000px] bg-[#ff8d00] font-sans text-[16px] font-bold text-white shadow-[0px_4px_0px_#b46300] disabled:cursor-not-allowed disabled:opacity-70"
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
