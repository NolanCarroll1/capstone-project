"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import { LogoutButton } from "@/app/_components/LogoutButton";
import { getSessionSnapshot, subscribeToSession } from "@/lib/auth/session";

export function FullTopMenu() {
	const [open, setOpen] = useState(false);
	const session = useSyncExternalStore(subscribeToSession, getSessionSnapshot, () => null);
	const canAccessAdmin = session?.role === "admin";

	return (
		<>
			<button
				type="button"
				aria-label={open ? "Close menu" : "Open menu"}
				onClick={() => setOpen((value) => !value)}
				className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-[#08394d] transition-colors hover:bg-[#dfe7ef]"
			>
				{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
			</button>

			{open ? (
				<div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)}>
					<nav
						aria-label="Module navigation"
						onClick={(event) => event.stopPropagation()}
						className="absolute left-1/2 top-0 w-full max-w-screen-sm -translate-x-1/2 rounded-b-[28px] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.14)]"
					>
						<div className="flex items-center justify-between px-6 pb-4 pt-6">
							<p className="font-mono text-[12px] font-bold tracking-[0.1em] text-[#99a1af]">MENU</p>
							<button
								type="button"
								aria-label="Close menu"
								onClick={() => setOpen(false)}
								className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#99a1af] transition-colors hover:bg-[#f3f4f6]"
							>
								<X className="h-4 w-4" />
							</button>
						</div>

						<div className="px-6 pb-6">
							<div className="flex items-center gap-3 rounded-full border border-[#e5e7eb] bg-[#f3f4f6] px-[17px] py-[13px]">
								<Search className="h-4 w-4 text-[#99a1af]" />
								<span className="font-sans text-[14px] text-[#999999]">Search</span>
							</div>
						</div>

						<div className="px-6 pb-3">
							<p className="font-mono text-[11px] tracking-[0.06em] text-[#99a1af]">NAVIGATE</p>
						</div>

						<ul className="space-y-5 px-6 pb-8">
							<li>
								<Link
									href="/profile"
									onClick={() => setOpen(false)}
									className="block font-sans text-[24px] font-normal leading-5 tracking-[-0.01em] text-[#666666]"
								>
									My Profile
								</Link>
							</li>
							{canAccessAdmin ? (
								<li>
									<Link
										href="/admin"
										onClick={() => setOpen(false)}
										className="block font-sans text-[24px] font-normal leading-5 tracking-[-0.01em] text-[#666666]"
									>
										Admin Panel
									</Link>
								</li>
							) : null}
							<li>
								<Link
									href="/dashboard"
									onClick={() => setOpen(false)}
									className="block font-sans text-[24px] font-normal leading-5 tracking-[-0.01em] text-[#666666]"
								>
									Dashboard
								</Link>
							</li>
							<li className="pt-1">
								<LogoutButton
									redirectTo="/login"
									onLoggedOut={() => setOpen(false)}
									variant="ghost"
									className="h-auto justify-start p-0 font-sans text-[24px] font-normal leading-5 tracking-[-0.01em] text-[#666666] hover:bg-transparent hover:text-[#444]"
								>
									Log out
								</LogoutButton>
							</li>
						</ul>
					</nav>
				</div>
			) : null}
		</>
	);
}
