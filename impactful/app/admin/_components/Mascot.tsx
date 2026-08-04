"use client";

import Image from "next/image";

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
		<Image
			src={adminAssets.mascot}
			alt={alt}
			width={size}
			height={size}
			unoptimized
			style={{ width: size, height: size, imageRendering: "pixelated" }}
			className={cn("animate-idle-bob select-none drop-shadow-sm", className)}
		/>
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