"use client";

import { CheckCircle2, Clock3, KeyRound } from "lucide-react";
import { useSyncExternalStore, useState } from "react";

import { SectionCard } from "../_components/primitives";
import { Button } from "@/components/ui/button";
import { inviteAdmin, listAdminAccounts, listAdminInvites, subscribeToAdminInvites } from "@/lib/auth/adminInvites";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
	const [inviteEmail, setInviteEmail] = useState("");
	const [inviteMessage, setInviteMessage] = useState("");
	const invites = useSyncExternalStore(subscribeToAdminInvites, listAdminInvites, () => []);
	const accounts = useSyncExternalStore(subscribeToAdminInvites, listAdminAccounts, () => []);
	const pending = invites.filter((invite) => !invite.claimedAt);
	const claimed = invites.filter((invite) => Boolean(invite.claimedAt));

	return (
		<section className="animate-rise-in space-y-6">
			<div>
				<div>
					<p className="eyebrow">Access</p>
					<h1 className="display-title text-[2rem] leading-[1.05] sm:text-[2.75rem]">Admin Access</h1>
				</div>
			</div>

			<SectionCard title="Invite an admin" description="Invite by email, then share the generated code securely.">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
					<label className="flex-1">
						<span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
							Admin email
						</span>
						<input
							value={inviteEmail}
							onChange={(event) => setInviteEmail(event.target.value)}
							placeholder="admin@impactful.org"
							className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
						/>
					</label>
					<Button
						type="button"
						className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
						onClick={() => {
							const result = inviteAdmin(inviteEmail);
							setInviteMessage(result.message);
							if (result.ok && result.code) {
								setInviteEmail("");
							}
						}}
					>
						Invite admin
					</Button>
				</div>
				{inviteMessage ? <p className="mt-3 text-sm text-muted-foreground">{inviteMessage}</p> : null}
				<div className="mt-5 grid gap-3 sm:grid-cols-3">
					<div className="rounded-xl border border-border bg-card px-4 py-3">
						<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Active codes</p>
						<p className="mt-2 text-2xl font-semibold text-foreground">{pending.length}</p>
					</div>
					<div className="rounded-xl border border-border bg-card px-4 py-3">
						<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Claimed invites</p>
						<p className="mt-2 text-2xl font-semibold text-foreground">{claimed.length}</p>
					</div>
					<div className="rounded-xl border border-border bg-card px-4 py-3">
						<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Admin accounts</p>
						<p className="mt-2 text-2xl font-semibold text-foreground">{accounts.length}</p>
					</div>
				</div>
			</SectionCard>

			<SectionCard title="Pending invites" description="Share these codes with the matching email owner.">
				{pending.length === 0 ? (
					<p className="py-6 text-sm text-muted-foreground">No active invite codes yet.</p>
				) : (
					<ul className="divide-y divide-border">
						{pending.map((invite) => (
							<li key={`${invite.email}-${invite.invitedAt}`} className="flex flex-wrap items-center gap-2 py-3">
								<span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
									<KeyRound className="h-3.5 w-3.5" />
									{invite.code}
								</span>
								<p className="min-w-0 flex-1 truncate text-sm text-foreground">{invite.email}</p>
								<span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground">
									<Clock3 className="h-3 w-3" />
									Pending
								</span>
							</li>
						))}
					</ul>
				)}
			</SectionCard>

			<SectionCard title="Admin accounts" description="Accounts that can sign in to the admin console.">
				{accounts.length === 0 ? (
					<p className="py-6 text-sm text-muted-foreground">No admin accounts found.</p>
				) : (
					<ul className="divide-y divide-border">
						{accounts.map((account) => (
							<li key={`${account.email}-${account.createdAt}`} className="flex items-center gap-2 py-3">
								<CheckCircle2 className="h-4 w-4 text-success" />
								<p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{account.email}</p>
								<span className={cn("rounded-full px-2.5 py-1 text-[11px]", "bg-success/12 text-success")}>Active</span>
							</li>
						))}
					</ul>
				)}
			</SectionCard>
		</section>
	);
}
