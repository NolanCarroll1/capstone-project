import Link from "next/link";
import Image from "next/image";

export function AdminEmptyState() {
	return (
		<div className="relative overflow-hidden rounded-3xl border border-dashed border-[#d7e3d5] bg-[#f5faf2] px-6 py-12 text-center">
			<span aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 text-[#d7e3d5]" />
			<div className="relative">
				<Image
					src="/assets/admin-mascot.png"
					alt=""
					width={88}
					height={88}
					className="mx-auto mb-4 h-22 w-22 rounded-2xl border border-[#d6e8d7] bg-white p-2"
				/>
				<p className="eyebrow">No modules yet</p>
				<h3 className="display-title mt-2 text-lg text-black">Create your first module</h3>
				<p className="mx-auto mt-2 max-w-[32ch] font-sans text-[14px] leading-[1.6] text-[#5f6c62]">
					Start with the deceptive-design template, then edit wording, images, and outcomes.
				</p>
			</div>
			<Link
				href="/admin/modules/new"
				className="relative mt-6 inline-flex h-10 items-center justify-center rounded-full bg-[#1f9a63] px-5 font-sans text-[12px] font-semibold uppercase tracking-widest text-white"
			>
				Create New Module
			</Link>
		</div>
	);
}
