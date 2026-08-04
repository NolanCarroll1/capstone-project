"use client";

import { cn } from "@/lib/utils";

export function ProgressRing({
	value,
	label,
	caption,
	tone = "brand",
	size = 108,
}: {
	value: number;
	label: string;
	caption?: string;
	tone?: "brand" | "teal" | "success";
	size?: number;
}) {
	const pct = Math.max(0, Math.min(100, value));
	const stroke = 9;
	const r = (size - stroke) / 2;
	const c = 2 * Math.PI * r;
	const toneClass =
		tone === "brand" ? "text-brand" : tone === "teal" ? "text-teal" : "text-success";

	return (
		<div className="flex flex-col items-center text-center">
			<div className="relative" style={{ width: size, height: size }}>
				<svg width={size} height={size} className="-rotate-90 overflow-visible">
					<circle
						cx={size / 2}
						cy={size / 2}
						r={r}
						fill="none"
						strokeWidth={stroke}
						className="text-secondary"
						stroke="currentColor"
					/>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={r}
						fill="none"
						strokeWidth={stroke}
						strokeLinecap="round"
						strokeDasharray={`${(pct / 100) * c} ${c}`}
						className={cn(toneClass, "transition-[stroke-dasharray] duration-700")}
						stroke="currentColor"
					/>
				</svg>
				<span className="display-title absolute inset-0 flex items-center justify-center text-xl tabular-nums">
					{pct}
					<span className="ml-0.5 text-xs text-muted-foreground">%</span>
				</span>
			</div>
			<p className="mt-3 text-sm font-medium">{label}</p>
			{caption ? <p className="mt-1 text-xs text-muted-foreground">{caption}</p> : null}
		</div>
	);
}

export function BarChart({
	data,
	tone = "teal",
}: {
	data: { label: string; value: number }[];
	tone?: "brand" | "teal";
}) {
	const max = Math.max(1, ...data.map((d) => d.value));
	const bar =
		tone === "brand"
			? "bg-linear-to-t from-brand/70 to-brand"
			: "bg-linear-to-t from-ocean to-teal";

	return (
		<div className="relative">
			<div className="pointer-events-none absolute inset-x-0 top-0 flex h-44 flex-col justify-between">
				{[0, 1, 2, 3].map((i) => (
					<span key={i} className="h-px w-full bg-border/70" />
				))}
			</div>
			<div className="relative flex h-44 items-stretch gap-3">
				{data.map((d) => (
					<div key={d.label} className="group flex min-w-0 flex-1 flex-col justify-end gap-2">
						<span className="text-center text-xs font-semibold tabular-nums text-muted-foreground transition-colors group-hover:text-foreground">
							{d.value}
						</span>
						<div
							className={cn(
								"w-full shrink-0 rounded-t-xl transition-opacity duration-300 group-hover:opacity-90",
								bar,
							)}
							style={{ height: `${Math.max(6, (d.value / max) * 140)}px` }}
						/>
					</div>
				))}
			</div>

			<div className="mt-2 flex gap-3">
				{data.map((d) => (
					<span
						key={d.label}
						className="min-w-0 flex-1 truncate text-center text-[11px] text-muted-foreground"
					>
						{d.label}
					</span>
				))}
			</div>
		</div>
	);
}