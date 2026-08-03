"use client";

import Link from "next/link";
import { useState } from "react";

import { ModulePreviewPanel } from "../_components/ModulePreviewPanel";
import { EmptyState } from "../_components/primitives";
import { Button } from "@/components/ui/button";
import { useModules } from "@/lib/admin/useModules";

export default function AdminPreviewPage() {
	const { modules, isLoading } = useModules();
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const selected = modules.find((m) => m.id === selectedId) ?? modules[0];

	return (
		<section className="animate-rise-in space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="eyebrow">Quality check</p>
					<h1 className="display-title text-[2rem] leading-[1.05] sm:text-[2.75rem]">Preview</h1>
				</div>
			</div>

			{isLoading ? (
				<section className="card-surface rounded-3xl p-6 sm:p-8">
					<p className="text-sm text-muted-foreground">Loading preview...</p>
				</section>
			) : modules.length === 0 ? (
				<EmptyState
					title="Nothing to preview"
					description="Create a module first, then return here to walk through it."
					action={
						<Button asChild className="rounded-full bg-brand text-brand-foreground">
							<Link href="/admin/modules/new">Create New Module</Link>
						</Button>
					}
				/>
			) : (
				<>
					<div className="flex flex-wrap gap-1">
						{modules.map((module) => (
							<button
								key={module.id}
								type="button"
								onClick={() => setSelectedId(module.id)}
								className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
									selected?.id === module.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"
								}`}
							>
								{module.title || "Untitled module"}
							</button>
						))}
					</div>
					{selected ? <ModulePreviewPanel moduleId={selected.id} /> : null}
				</>
			)}
		</section>
	);
}
