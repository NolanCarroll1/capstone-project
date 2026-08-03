import Link from "next/link";

import { StatusBadge } from "./primitives";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/admin/helpers";
import type { LearningModule } from "@/lib/admin/types";

export function ModuleCard({
	module,
	onDuplicate,
	onDelete,
	onToggleStatus,
}: {
	module: LearningModule;
	onDuplicate: (id: string) => void;
	onDelete: (module: LearningModule) => void;
	onToggleStatus: (module: LearningModule) => void;
}) {
	return (
		<article className="card-surface flex flex-col rounded-2xl p-5">
			<div className="flex items-start justify-between gap-3">
				<h3 className="display-title text-lg leading-tight">{module.title || "Untitled module"}</h3>
				<StatusBadge status={module.status} />
			</div>

			<p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
				{module.description || "No description yet."}
			</p>

			<dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
				<div className="flex gap-1">
					<dt className="eyebrow">Phases</dt>
					<dd className="font-medium text-foreground">{module.phases.length}</dd>
				</div>
				<div className="flex gap-1">
					<dt className="eyebrow">Minutes</dt>
					<dd className="font-medium text-foreground">{module.estimatedMinutes}</dd>
				</div>
				<div className="flex gap-1">
					<dt className="eyebrow">Updated</dt>
					<dd className="font-medium text-foreground">{formatDate(module.updatedAt)}</dd>
				</div>
			</dl>

			<div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
				<Button asChild size="sm" variant="secondary" className="rounded-full">
					<Link href={`/admin/modules/${module.id}/edit`}>Edit</Link>
				</Button>
				<Button asChild size="sm" variant="ghost" className="rounded-full">
					<Link href={`/admin/modules/${module.id}/preview`}>Preview</Link>
				</Button>
				<Button size="sm" variant="ghost" className="rounded-full" onClick={() => onDuplicate(module.id)}>
					Duplicate
				</Button>
				<Button
					size="sm"
					variant="ghost"
					className="rounded-full text-destructive hover:text-destructive"
					onClick={() => onDelete(module)}
				>
					Delete
				</Button>
				<Button
					size="sm"
					variant="outline"
					className="ml-auto rounded-full"
					onClick={() => onToggleStatus(module)}
				>
					{module.status === "published" ? "Unpublish" : "Publish"}
				</Button>
			</div>
		</article>
	);
}