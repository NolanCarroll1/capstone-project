"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import CustomizationsIndex from "../_components/CustomizationsIndex";
import { Button } from "@/components/ui/button";

export default function AdminCustomizationsPage() {
	return (
		<section className="animate-rise-in space-y-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="eyebrow">Admin</p>
					<h1 className="display-title text-[2rem] leading-[1.05] sm:text-[2.75rem]">Customizations</h1>
				</div>
				<Button asChild className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
					<Link href="/admin/customizations/new">
						<Plus className="h-4 w-4" /> New customization
					</Link>
				</Button>
			</div>

			<CustomizationsIndex />
		</section>
	);
}
