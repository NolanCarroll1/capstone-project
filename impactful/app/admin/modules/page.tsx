"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { ModuleCard } from "../_components/ModuleCard";
import { EmptyState, SectionCard } from "../_components/primitives";
import { Button } from "@/components/ui/button";
import { useModules } from "@/lib/admin/useModules";

const FILTERS = ["all", "draft", "published"] as const;
type ModuleFilter = (typeof FILTERS)[number];

export default function AdminModulesPage() {
	const router = useRouter();
	const { modules, isLoading, remove, duplicate, setStatus } = useModules();
	const [filter, setFilter] = useState<ModuleFilter>("all");

	const visibleModules = useMemo(() => {
		return modules
			.filter((module) => filter === "all" || module.status === filter)
			.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
	}, [modules, filter]);

	return (
		<section className="animate-rise-in space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="eyebrow">Library</p>
					<h1 className="display-title text-[2rem] leading-[1.05] sm:text-[2.75rem]">Modules</h1>
				</div>
				<Button asChild className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
					<Link href="/admin/modules/new">
						<Plus className="h-4 w-4" /> Create New Module
					</Link>
				</Button>
			</div>

			<div className="flex flex-wrap gap-1">
				{FILTERS.map((option) => (
					<button
						key={option}
						type="button"
						onClick={() => setFilter(option)}
						className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
							filter === option
								? "bg-foreground text-background"
								: "text-muted-foreground hover:bg-secondary"
						}`}
					>
						{option}
					</button>
				))}
			</div>

			{isLoading ? (
				<SectionCard>
					<p className="py-10 text-center text-sm text-muted-foreground">Loading modules...</p>
				</SectionCard>
			) : visibleModules.length === 0 ? (
				<EmptyState
					title="Nothing here yet"
					description="No modules match this filter. Create a new module or switch filters."
					action={
						<Button asChild className="rounded-full bg-brand text-brand-foreground">
							<Link href="/admin/modules/new">Create New Module</Link>
						</Button>
					}
				/>
			) : (
				<div className="grid gap-4 lg:grid-cols-2">
					{visibleModules.map((module) => (
						<ModuleCard
							key={module.id}
							module={module}
							onDuplicate={(id) => {
								const duplicated = duplicate(id);
								if (duplicated) {
									router.push(`/admin/modules/${duplicated.id}/edit`);
								}
							}}
							onDelete={(moduleToDelete) => {
								if (window.confirm(`Delete \"${moduleToDelete.title || "this module"}\"? This cannot be undone.`)) {
									remove(moduleToDelete.id);
								}
							}}
							onToggleStatus={(moduleToToggle) =>
								setStatus(moduleToToggle.id, moduleToToggle.status === "draft" ? "published" : "draft")
							}
						/>
					))}
				</div>
			)}
		</section>
	);
}
