"use client";

import type { ReactNode } from "react";

import { Mascot } from "./Mascot";
import { cn } from "@/lib/utils";
import type { LearningModuleStatus } from "@/lib/admin/types";

export function SectionCard({
	title,
	description,
	actions,
	children,
	className,
}: {
	title?: string;
	description?: string;
	actions?: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("card-surface rounded-3xl p-5 sm:p-6", className)}>
			{title || actions ? (
				<div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
					<div>
						{title ? (
							<h2 className="display-title flex items-center gap-2.5 text-base">
								<span className="h-3.5 w-1 rounded-full bg-brand" aria-hidden />
								{title}
							</h2>
						) : null}
						{description ? <p className="mt-1.5 text-sm text-muted-foreground">{description}</p> : null}
					</div>
					{actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
				</div>
			) : null}
			{children}
		</section>
	);
}

export function StatusBadge({ status }: { status: LearningModuleStatus }) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]",
				status === "published" ? "bg-success/12 text-success" : "bg-secondary text-muted-foreground",
			)}
		>
			<span
				className={cn(
					"h-1.5 w-1.5 rounded-full",
					status === "published" ? "bg-success" : "bg-muted-foreground/60",
				)}
				aria-hidden
			/>
			{status === "published" ? "Published" : "Draft"}
		</span>
	);
}

export function StatCard({
	label,
	value,
	hint,
}: {
	label: string;
	value: ReactNode;
	hint?: string;
}) {
	return (
		<div className="card-surface card-lift relative overflow-hidden rounded-3xl p-5">
			<span className="absolute inset-x-0 top-0 h-1 bg-brand/80" aria-hidden />
			<p className="eyebrow">{label}</p>
			<p className="display-title mt-3 text-4xl tabular-nums">{value}</p>
			{hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
		</div>
	);
}

export function EmptyState({
	title,
	description,
	action,
}: {
	title: string;
	description: string;
	action?: ReactNode;
}) {
	return (
		<div className="relative overflow-hidden rounded-3xl border border-dashed border-border bg-secondary/40 px-6 py-14 text-center">
			<span className="dot-grid pointer-events-none absolute inset-0 text-border/70" aria-hidden />
			<div className="relative">
				<Mascot size={88} className="mx-auto mb-4" alt="" />
				<h3 className="display-title text-lg">{title}</h3>
				<p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
				{action ? <div className="mt-6 flex justify-center">{action}</div> : null}
			</div>
		</div>
	);
}