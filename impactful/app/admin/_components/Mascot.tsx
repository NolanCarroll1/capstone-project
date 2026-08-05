"use client";

import { adminAssets } from "../_assets";
import { cn } from "@/lib/utils";

export function Mascot({
	className,
	size = 96,
	alt = "Impactful mascot",
}: {
	className?: string;
	size?: number;
	alt?: string;
}) {
	return (
		<div
			className={cn("relative overflow-hidden animate-idle-bob select-none drop-shadow-sm", className)}
			style={{ width: size, height: size }}
			aria-hidden={alt === "" ? true : undefined}
		>
			<img
				src={adminAssets.mascot}
				alt={alt}
				className="pointer-events-none absolute max-w-none"
				style={{
					height: "441.38%",
					width: "711.11%",
					left: "-19.91%",
					top: "-100%",
					imageRendering: "pixelated",
				}}
				draggable={false}
			/>
		</div>
	);
}

export function AmbientLeaves({ count = 7 }: { count?: number }) {
	return (
		<div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
			{Array.from({ length: count }).map((_, i) => (
				<span
					key={i}
					className="animate-leaf-drift absolute block h-1.5 w-2.5 rounded-[1px] bg-[oklch(0.72_0.16_142)]/70"
					style={{
						top: `${8 + ((i * 13) % 78)}%`,
						left: "-6%",
						animationDelay: `${i * 2.3}s`,
						animationDuration: `${13 + (i % 4) * 3}s`,
					}}
				/>
			))}
		</div>
	);
}