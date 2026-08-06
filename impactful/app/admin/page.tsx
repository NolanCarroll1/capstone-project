"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { useSyncExternalStore } from "react";

import { adminAssets } from "./_assets";
import { AmbientLeaves, Mascot } from "./_components/Mascot";
import { BarChart, ProgressRing } from "./_components/charts";
import { EmptyState, SectionCard, StatCard, StatusBadge } from "./_components/primitives";
import { Button } from "@/components/ui/button";
import { listAdminAccounts, listAdminInvites, subscribeToAdminInvites } from "@/lib/auth/adminInvites";
import { formatDate } from "@/lib/admin/helpers";
import { useModules } from "@/lib/admin/useModules";

function HeroStat({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="admin-hero-kpi rounded-[1.7rem] px-5 py-4 sm:px-6 sm:py-5">
			<p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-foreground/60">{label}</p>
			<p className="display-title mt-1.5 text-3xl tabular-nums text-teal-foreground">{value}</p>
		</div>
	);
}

export default function AdminDashboardPage() {
	const { modules } = useModules();
	const adminAccounts = useSyncExternalStore(subscribeToAdminInvites, listAdminAccounts, () => []);
	const adminInvites = useSyncExternalStore(subscribeToAdminInvites, listAdminInvites, () => []);
	const published = modules.filter((m) => m.status === "published");
	const drafts = modules.filter((m) => m.status === "draft");
	const phaseCount = modules.reduce((sum, m) => sum + m.phases.length, 0);
	const completion = modules.length ? Math.round((published.length / modules.length) * 100) : 0;
	const inviteCompletion = adminInvites.length ? Math.round((adminInvites.filter((invite) => Boolean(invite.claimedAt)).length / adminInvites.length) * 100) : 0;
	const recent = [...modules].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
	const progressBuckets = [
		{ label: "Pending", value: adminInvites.filter((invite) => !invite.claimedAt).length },
		{ label: "Claimed", value: adminInvites.filter((invite) => Boolean(invite.claimedAt)).length },
		{ label: "Accounts", value: adminAccounts.length },
		{ label: "Draft modules", value: drafts.length },
	];

	return (
		<section className="animate-rise-in space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="eyebrow">Admin console</p>
					<h1 className="display-title text-[2rem] leading-[1.05] sm:text-[2.75rem]">Dashboard</h1>
				</div>
				<Button asChild className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
					<Link href="/admin/modules/new">
						<Plus className="h-4 w-4" /> Create New Module
					</Link>
				</Button>
			</div>

			<section className="animate-rise-in relative overflow-hidden rounded-[1.75rem] bg-teal p-6 sm:p-9">
				<span className="organic-mesh pointer-events-none absolute inset-0 opacity-75" aria-hidden />
				<span className="vine-lattice pointer-events-none absolute inset-0 text-teal-foreground/6" aria-hidden />
				<span className="dot-grid pointer-events-none absolute inset-0 text-teal-foreground/8" aria-hidden />
				<AmbientLeaves />
				<div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
					<div className="min-w-0">
						<h2 className="display-title mt-4 max-w-lg text-[1.6rem] leading-[1.1] text-teal-foreground sm:text-4xl">
							Learning that moves people from insight to impact.
						</h2>
						<p className="mt-3 max-w-md text-sm text-teal-foreground/70">
							{published.length} published · {drafts.length} in progress · {phaseCount} phases authored.
						</p>
					</div>
					<Mascot size={116} className="shrink-0 self-center sm:self-auto" />
				</div>
				<div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
					<HeroStat label="Admin accounts" value={adminAccounts.length} />
					<HeroStat label="Modules" value={modules.length} />
					<HeroStat label="Phases" value={phaseCount} />
					<HeroStat label="Invite completion" value={`${inviteCompletion}%`} />
				</div>
				<div className="pointer-events-none relative mt-6 -mb-6 -mx-6 select-none sm:-mx-9 sm:-mb-9">
					<Image
						src={adminAssets.villageBanner}
						alt=""
						width={1920}
						height={512}
						loading="eager"
						unoptimized
						aria-hidden
						className="block h-auto w-full opacity-90"
						style={{ imageRendering: "pixelated" }}
					/>
				</div>
			</section>

			<div className="mt-6 grid gap-4 lg:grid-cols-3">
				<SectionCard title="Progress" description="Across modules and admin onboarding." className="lg:col-span-1">
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2">
						<ProgressRing value={inviteCompletion} label="Invite claims" tone="brand" />
						<ProgressRing value={completion} label="Published" tone="teal" />
					</div>
				</SectionCard>

				<SectionCard title="Access activity" description="Invite and account status." className="lg:col-span-2">
					<BarChart data={progressBuckets} />
				</SectionCard>
			</div>

			<div className="mt-6 grid gap-4 lg:grid-cols-3">
				<SectionCard
					title="Recent activity"
					description="Most recently updated first."
					className="lg:col-span-2"
					actions={
						<Button asChild variant="ghost" className="rounded-full">
							<Link href="/admin/modules">View all</Link>
						</Button>
					}
				>
						{recent.length === 0 ? (
							<EmptyState
								title="No modules yet"
								description="Create your first structured learning module to get started."
								action={
									<Button asChild className="rounded-full bg-brand text-brand-foreground">
										<Link href="/admin/modules/new">Create New Module</Link>
									</Button>
								}
							/>
						) : (
							<ul className="-my-1 divide-y divide-border">
								{recent.map((module) => (
									<li key={module.id} className="-mx-2 flex flex-wrap items-center gap-3 rounded-2xl px-2 py-3 transition-colors hover:bg-secondary/60">
										<span className="display-title flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cream text-sm text-teal">
											{(module.title || "U").charAt(0)}
										</span>
										<div className="min-w-0 flex-1">
											<p className="truncate font-medium">{module.title || "Untitled module"}</p>
											<p className="truncate text-xs text-muted-foreground">
												{module.phases.length} phases · updated {formatDate(module.updatedAt)}
											</p>
										</div>
										<StatusBadge status={module.status} />
										<Button asChild size="sm" variant="secondary" className="rounded-full">
											<Link href={`/admin/modules/${module.id}/edit`}>Edit</Link>
										</Button>
									</li>
								))}
							</ul>
						)}
				</SectionCard>

				<SectionCard
					title="People"
					description="Admin access directory."
					actions={
						<Button asChild variant="ghost" size="sm" className="rounded-full">
							<Link href="/admin/users">
								Manage <ArrowUpRight className="h-3.5 w-3.5" />
							</Link>
						</Button>
					}
				>
					<ul className="space-y-2.5">
						{adminAccounts.slice(0, 5).map((account) => (
							<li key={account.email} className="-mx-2 flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors hover:bg-secondary/60">
								<span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-xs font-semibold text-teal ring-1 ring-leaf/25">
									{account.email.slice(0, 2).toUpperCase()}
								</span>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium">{account.email}</p>
									<p className="truncate text-xs text-muted-foreground">Admin account</p>
								</div>
								<span className="rounded-full bg-brand/15 px-2.5 py-1 text-[11px] font-medium text-brand">
									Admin
								</span>
							</li>
						))}
						{adminAccounts.length === 0 ? <p className="text-sm text-muted-foreground">No admin accounts yet.</p> : null}
					</ul>
				</SectionCard>
			</div>

			<div className="mt-6 grid gap-4 sm:grid-cols-3">
				<StatCard label="Published" value={published.length} hint="Live for learners" />
				<StatCard label="Drafts" value={drafts.length} hint="Still in progress" />
				<StatCard label="Total phases" value={phaseCount} hint="Across all modules" />
			</div>
		</section>
	);
}
