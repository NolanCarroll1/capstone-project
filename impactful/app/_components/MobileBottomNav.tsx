"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
	href: string;
	label: string;
	icon: string;
	active: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
	{
		href: "/dashboard",
		label: "Dashboard",
		icon: "◼",
		active: (pathname) => pathname === "/dashboard" || pathname.startsWith("/modules"),
	},
	{
		href: "/profile",
		label: "Profile",
		icon: "◉",
		active: (pathname) => pathname.startsWith("/profile"),
	},
];

export function MobileBottomNav() {
	const pathname = usePathname();

	return (
		<nav
			aria-label="Primary"
			className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-[#eceff3] bg-white px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-2 shadow-[0_-6px_24px_rgba(0,0,0,0.06)]"
		>
			<ul className="grid grid-cols-2 gap-1">
				{navItems.map((item) => {
					const isActive = item.active(pathname);

					return (
						<li key={item.href}>
							<Link
								href={item.href}
								aria-current={isActive ? "page" : undefined}
								className={`flex flex-col items-center rounded-xl px-3 py-2 transition-colors ${
									isActive ? "bg-black text-white" : "text-[#7a8396] hover:bg-[#f5f6f8]"
								}`}
							>
								<span className="font-sans text-[13px] leading-none">{item.icon}</span>
								<span className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
									{item.label}
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
