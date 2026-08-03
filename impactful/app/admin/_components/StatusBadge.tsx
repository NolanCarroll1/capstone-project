import type { LearningModuleStatus } from "@/lib/admin/types";

export function StatusBadge({ status }: { status: LearningModuleStatus }) {
	const isPublished = status === "published";

	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
				isPublished ? "bg-[#e9f9ef] text-[#1d7a40]" : "bg-[#eef3ee] text-[#647368]"
			}`}
		>
			<span
				aria-hidden="true"
				className={`h-1.5 w-1.5 rounded-full ${isPublished ? "bg-[#1d7a40]" : "bg-[#6b7a6f]"}`}
			/>
			{isPublished ? "Published" : "Draft"}
		</span>
	);
}
