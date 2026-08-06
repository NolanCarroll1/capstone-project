"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";

import { RequireSession } from "../../_components/RequireSession";
import { FullTopMenu } from "../../modules/_components/FullTopMenu";
import { getSessionSnapshot, subscribeToSession } from "@/lib/auth/session";

function toTitleCase(value: string) {
	return value
		.toLowerCase()
		.replace(/(^|[\s\-'])[a-z]/g, (match) => match.toUpperCase());
}

function getNameParts(name?: string) {
	if (!name) {
		return [];
	}

	return name
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((part) => toTitleCase(part));
}

function getEmailChunks(email?: string) {
	if (!email) {
		return [];
	}

	const localPart = email.split("@")[0] ?? "";
	return localPart
		.split(/[._\-\s]+/)
		.filter(Boolean)
		.map((chunk) => toTitleCase(chunk));
}

function getDisplayName(name?: string, email?: string) {
	const nameParts = getNameParts(name);
	if (nameParts.length > 0) {
		return nameParts.join(" ");
	}

	const emailChunks = getEmailChunks(email);
	if (emailChunks.length > 0) {
		return emailChunks.join(" ");
	}

	return "Impactful User";
}

function getDisplayInitials(name?: string, email?: string) {
	const nameParts = getNameParts(name);
	if (nameParts.length >= 2) {
		return `${nameParts[0][0] ?? ""}${nameParts[nameParts.length - 1][0] ?? ""}`.toUpperCase();
	}
	if (nameParts.length === 1) {
		return nameParts[0].slice(0, 2).toUpperCase();
	}

	const emailChunks = getEmailChunks(email);
	if (emailChunks.length >= 2) {
		return `${emailChunks[0][0] ?? ""}${emailChunks[1][0] ?? ""}`.toUpperCase();
	}
	if (emailChunks.length === 1) {
		return emailChunks[0].slice(0, 2).toUpperCase();
	}

	return "IU";
}

export default function EditProfilePage() {
	const session = useSyncExternalStore(subscribeToSession, getSessionSnapshot, () => null);
	const initialName = useMemo(() => getDisplayName(session?.name, session?.email), [session?.name, session?.email]);
	const initialEmail = session?.email ?? "No email";
	const initials = getDisplayInitials(session?.name, session?.email);

	const [name, setName] = useState(initialName);
	const [email, setEmail] = useState(initialEmail);

	return (
		<RequireSession>
			<main className="min-h-dvh bg-[#f8f8f8] text-black sm:flex sm:justify-center">
				<section className="mx-auto min-h-dvh w-full max-w-screen-sm bg-[#f8f8f8]">
					<header className="sticky top-0 z-30 border-b border-[#f3f4f6] bg-[#eef1f4] px-6 py-4">
						<div className="flex items-center justify-between">
							<Image
								src="/assets/figma-capstone/dashboard-impactful-wordmark-node-1115-748.png"
								alt="Impactful"
								width={100}
								height={48}
								unoptimized
								className="h-12 w-[100px] object-contain"
							/>
							<FullTopMenu />
						</div>
					</header>

					<div className="px-6 pb-4 pt-6">
						<div className="flex items-center gap-4">
							<Link
								href="/profile"
								aria-label="Back to profile"
								className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#6a7282] transition-colors hover:bg-white"
							>
								<ArrowLeft className="h-4.5 w-4.5" />
							</Link>
							<h1 className="font-sans text-[17px] font-bold leading-[1.5] text-black">Edit Profile</h1>
						</div>
					</div>

					<div className="px-6">
						<div className="flex flex-col items-center gap-3">
							<div className="relative h-24 w-24">
								<div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0e6b7c]">
									<span className="font-sans text-[30px] font-bold leading-9 text-white">{initials}</span>
								</div>
								<button
									type="button"
									aria-label="Change profile photo"
									className="absolute left-[68px] top-[68px] inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ff8d00] text-white shadow-[0px_2px_0px_#b46300]"
								>
									<Camera className="h-3.5 w-3.5" />
								</button>
							</div>
							<p className="font-mono text-[13px] tracking-[0.08em] text-[#99a1af]">TAP CAMERA TO CHANGE PHOTO</p>
						</div>

						<div className="py-6">
							<div className="w-full rounded-3xl border-[1.804px] border-[#f1f3f6] bg-white p-[25.804px] shadow-[0px_4px_0px_#eff1f5]">
								<label className="block">
									<span className="pb-2 font-mono text-xs font-bold tracking-[0.1em] text-[#99a1af]">NAME</span>
									<input
										type="text"
										value={name}
										onChange={(event) => setName(event.target.value)}
										className="mt-2 h-[50px] w-full rounded-2xl border-[1.804px] border-[#f1f3f6] bg-[#f8f8f8] px-[18px] font-sans text-[15px] font-semibold text-black outline-none"
									/>
								</label>

								<label className="mt-5 block">
									<span className="pb-2 font-mono text-xs font-bold tracking-[0.1em] text-[#99a1af]">EMAIL</span>
									<input
										type="email"
										value={email}
										onChange={(event) => setEmail(event.target.value)}
										className="mt-2 h-[50px] w-full rounded-2xl border-[1.804px] border-[#f1f3f6] bg-[#f8f8f8] px-[18px] font-sans text-[15px] font-semibold text-black outline-none"
									/>
								</label>
							</div>
						</div>

						<button
							type="button"
							className="mb-8 h-[52px] w-full rounded-full bg-[#ff8d00] font-mono text-sm font-bold tracking-[0.1em] text-white shadow-[0px_4px_0px_#b46300]"
						>
							SAVE CHANGES
						</button>
					</div>
				</section>
			</main>
		</RequireSession>
	);
}
