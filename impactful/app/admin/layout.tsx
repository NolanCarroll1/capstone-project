import Link from "next/link";
import { LogoutButton } from "../_components/LogoutButton";
import { RequireSession } from "../_components/RequireSession";
import { AdminIdentityBadge } from "./_components/AdminIdentityBadge";
import { AdminTopNav } from "./_components/AdminTopNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<RequireSession requiredRole="admin" redirectTo="/login">
			<main className="admin-root relative min-h-screen text-black">
				<span aria-hidden="true" className="sun-halo pointer-events-none fixed inset-x-0 top-0 h-105" />
				<header className="admin-shell-header sticky top-0 z-30">
					<div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
						<Link
							href="/admin"
							className="flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6a20a]"
						>
							<span className="relative inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#0f5047] text-[#f6ffe2] shadow-[0_8px_20px_-12px_rgba(15,80,71,0.6)]">
								<AdminIdentityBadge />
								<span aria-hidden="true" className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#f6a20a]" />
							</span>
							<span className="flex min-w-0 flex-col leading-none">
								<span className="display-title text-base">Impactful</span>
								<span className="mt-0.5 hidden text-[11px] text-[#647368] sm:inline">Admin console</span>
							</span>
						</Link>
						<div className="flex items-center gap-2">
							<AdminTopNav />
							<LogoutButton redirectTo="/login" variant="ghost" className="hidden rounded-full text-sm font-medium text-[#5b6b60] hover:bg-[#edf5ee] hover:text-[#253a30] md:inline-flex">
								Log out
							</LogoutButton>
						</div>
					</div>
				</header>

				<section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
					{children}
				</section>
			</main>
		</RequireSession>
	);
}
