"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { LogoutButton } from "@/app/_components/LogoutButton";

const navItems = [
	{ label: "Dashboard", href: "/dashboard" },
	{ label: "Profile", href: "/profile" },
] as const;

export function ModuleTopMenu() {
	const [open, setOpen] = useState(false);

	return (
		<div className="relative">
			<button
				type="button"
				aria-label={open ? "Close menu" : "Open menu"}
				aria-expanded={open}
				onClick={() => setOpen((current) => !current)}
				className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-[#08394d] transition-colors hover:bg-[#dfe7ef]"
			>
				{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
			</button>

			{open ? (
				<nav
					aria-label="Module navigation"
					className="absolute right-0 top-[calc(100%+8px)] z-30 min-w-44 rounded-2xl border border-[#dfe7de] bg-white p-2 shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
				>
					<ul className="space-y-1">
						{navItems.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									onClick={() => setOpen(false)}
									className="block rounded-xl px-3 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f3f4f6]"
								>
									{item.label}
								</Link>
							</li>
						))}
						<li>
							<LogoutButton
								redirectTo="/login"
								onLoggedOut={() => setOpen(false)}
								variant="ghost"
								className="w-full justify-start rounded-xl px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#f3f4f6] hover:text-[#111827]"
							>
								Log out
							</LogoutButton>
						</li>
					</ul>
				</nav>
			) : null}
		</div>
	);
}
