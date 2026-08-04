"use client";

import { useMemo, useState } from "react";
import { customizations as sample, Customization } from "../_data/customizations";

export default function CustomizationsIndex() {
	const [query, setQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<"all" | "theme" | "text" | "setting">("all");
	const [items, setItems] = useState<Customization[]>(sample);

	const visible = useMemo(() => {
		return items.filter((c) => {
			if (typeFilter !== "all" && c.type !== typeFilter) return false;
			if (!query) return true;
			const q = query.toLowerCase();
			return (c.name || "").toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q);
		});
	}, [items, query, typeFilter]);

	function toggleEnabled(id: string) {
		setItems((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled, updatedAt: new Date().toISOString() } : p)));
	}

	return (
		<section className="space-y-4">
			<div className="flex flex-wrap items-center gap-3">
				<input
				aria-label="Search customizations"
				type="search"
				value={query}
				onChange={(e: any) => setQuery(e.target.value)}
				placeholder="Search customizations..."
				className="max-w-lg rounded-full border px-3 py-1 text-sm"
			/>

				<select
					value={typeFilter}
					onChange={(e) => setTypeFilter(e.target.value as any)}
					className="rounded-full border px-3 py-1 text-sm"
				>
					<option value="all">All types</option>
					<option value="theme">Theme</option>
					<option value="text">Text</option>
					<option value="setting">Setting</option>
				</select>
			</div>

			<div className="divide-border rounded-2xl border bg-background p-4">
				{visible.length === 0 ? (
					<p className="py-6 text-center text-sm text-muted-foreground">No customizations match your filters.</p>
				) : (
					<ul className="space-y-3">
						{visible.map((c) => (
							<li key={c.id} className="flex items-center justify-between gap-4 rounded-xl px-3 py-2 hover:bg-secondary/50">
								<div className="min-w-0">
									<p className="truncate font-medium">{c.name}</p>
									<p className="truncate text-xs text-muted-foreground">{c.description}</p>
								</div>
								<div className="flex items-center gap-4">
													<span className="text-xs text-muted-foreground">{c.type}</span>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={c.enabled}
											onChange={() => toggleEnabled(c.id)}
											className="h-4 w-4 rounded"
										/>
									</label>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
}
