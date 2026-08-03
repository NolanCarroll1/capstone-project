"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LogoutButton } from "@/app/_components/LogoutButton";

type NavItem = {
	label: string;
	href: string;
	isActive: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
	{
		label: "Dashboard",
		href: "/admin",
		isActive: (pathname) => pathname === "/admin",
	},
	{
		label: "Modules",
		href: "/admin/modules",
		isActive: (pathname) => pathname.startsWith("/admin/modules"),
	},
	{
		label: "Users",
		href: "/admin/users",
		isActive: (pathname) => pathname.startsWith("/admin/users"),
	},
	{
		label: "Preview",
		href: "/admin/preview",
		isActive: (pathname) => pathname.startsWith("/admin/preview"),
	},
];

export function AdminTopNav() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	const linkClass = (isActive: boolean) =>
		`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
			isActive
				? "bg-[#0f5047] text-[#f6ffe2]"
				: "text-[#5b6b60] hover:bg-[#edf5ee] hover:text-[#253a30]"
		}`;

	return (
		<>
			<nav className="admin-pill hidden items-center gap-1 p-1 md:flex" aria-label="Admin navigation">
				{navItems.map((item) => {
					const isActive = item.isActive(pathname);
					return (
						<Link
							key={item.href}
							href={item.href}
							className={linkClass(isActive)}
							aria-current={isActive ? "page" : undefined}
						>
							{item.label}
						</Link>
					);
				})}
			</nav>

			<button
				type="button"
				aria-label={open ? "Close menu" : "Open menu"}
				onClick={() => setOpen((v) => !v)}
				className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe7de] bg-white text-[#1f352c] transition-colors hover:bg-[#edf5ee] md:hidden"
			>
				{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
			</button>

			{open ? (
				<nav className="animate-rise-in absolute left-0 right-0 top-full z-30 border-t border-[#dfe7de] bg-[#f8faf5] px-4 py-3 md:hidden" aria-label="Admin mobile navigation">
					<div className="mx-auto flex max-w-6xl flex-col gap-1">
						{navItems.map((item) => {
							const isActive = item.isActive(pathname);
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setOpen(false)}
									className={linkClass(isActive)}
									aria-current={isActive ? "page" : undefined}
								>
									{item.label}
								</Link>
							);
						})}
						<LogoutButton
							redirectTo="/login"
							variant="ghost"
							onLoggedOut={() => setOpen(false)}
							className="justify-start rounded-full px-4 py-2 text-sm font-medium text-[#5b6b60] hover:bg-[#edf5ee] hover:text-[#253a30]"
						>
							Log out
						</LogoutButton>
					</div>
				</nav>
			) : null}
		</>
	);
}
