import { type NextRequest, NextResponse } from "next/server";

import type { LearningModule, LearningModuleStatus } from "@/lib/admin/types";

import { moduleFromRow, requireAdminSupabase } from "../../_lib";

type ModuleRow = {
	id: string;
	slug: string | null;
	title: string | null;
	status: string | null;
	created_at: string | null;
	updated_at: string | null;
	data: LearningModule | null;
};

type StatusPayload = {
	status?: LearningModuleStatus;
};

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const auth = await requireAdminSupabase(request);
	if ("error" in auth) {
		return auth.error;
	}

	const { id } = await params;
	let payload: StatusPayload;
	try {
		payload = (await request.json()) as StatusPayload;
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	if (payload.status !== "draft" && payload.status !== "published") {
		return NextResponse.json({ error: "Invalid status" }, { status: 400 });
	}

	const { supabase } = auth;
	const { data: existing, error: fetchError } = await supabase
		.from("learning_modules")
		.select("id, slug, title, status, created_at, updated_at, data")
		.eq("id", id)
		.maybeSingle();
	if (fetchError) {
		return NextResponse.json(
			{
				error: "Failed to fetch module",
				details: fetchError.message,
			},
			{ status: 500 },
		);
	}

	if (!existing) {
		return NextResponse.json({ error: "Module not found" }, { status: 404 });
	}

	const moduleData = moduleFromRow(existing as ModuleRow);
	if (!moduleData) {
		return NextResponse.json({ error: "Invalid module payload" }, { status: 500 });
	}

	const updated: LearningModule = {
		...moduleData,
		status: payload.status,
		updatedAt: new Date().toISOString(),
	};

	const { data, error } = await supabase
		.from("learning_modules")
		.update({
			status: updated.status,
			data: updated,
		})
		.eq("id", id)
		.select("id, slug, title, status, created_at, updated_at, data")
		.maybeSingle();

	if (error) {
		return NextResponse.json(
			{
				error: "Failed to update module status",
				details: error.message,
			},
			{ status: 500 },
		);
	}

	const saved = moduleFromRow(data as ModuleRow);
	if (!saved) {
		return NextResponse.json({ error: "Updated module payload missing" }, { status: 500 });
	}

	return NextResponse.json({ module: saved });
}
