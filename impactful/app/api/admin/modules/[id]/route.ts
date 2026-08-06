import { type NextRequest, NextResponse } from "next/server";

import type { LearningModule } from "@/lib/admin/types";

import {
	moduleFromRow,
	moduleToRow,
	normalizeModule,
	parseLearningModule,
	requireAdminSupabase,
} from "../_lib";

type ModuleRow = {
	id: string;
	slug: string | null;
	title: string | null;
	status: string | null;
	created_at: string | null;
	updated_at: string | null;
	data: LearningModule | null;
};

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const auth = await requireAdminSupabase(request);
	if ("error" in auth) {
		return auth.error;
	}

	const { id } = await params;
	const { supabase } = auth;
	const { data, error } = await supabase
		.from("learning_modules")
		.select("id, slug, title, status, created_at, updated_at, data")
		.eq("id", id)
		.maybeSingle();

	if (error) {
		return NextResponse.json(
			{
				error: "Failed to fetch module",
				details: error.message,
			},
			{ status: 500 },
		);
	}

	if (!data) {
		return NextResponse.json({ error: "Module not found" }, { status: 404 });
	}

	const moduleData = moduleFromRow(data as ModuleRow);
	if (!moduleData) {
		return NextResponse.json({ error: "Invalid module payload" }, { status: 500 });
	}

	return NextResponse.json({ module: moduleData });
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const auth = await requireAdminSupabase(request);
	if ("error" in auth) {
		return auth.error;
	}

	const { id } = await params;

	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const parsed = parseLearningModule(payload);
	if (!parsed) {
		return NextResponse.json({ error: "Invalid learning module payload" }, { status: 400 });
	}

	if (parsed.id !== id) {
		return NextResponse.json({ error: "Path id and payload id do not match" }, { status: 400 });
	}

	const normalizedModule = normalizeModule(parsed);
	const { supabase, user } = auth;
	const { data, error } = await supabase
		.from("learning_modules")
		.upsert(moduleToRow(normalizedModule, user.id), { onConflict: "id" })
		.select("id, slug, title, status, created_at, updated_at, data")
		.maybeSingle();

	if (error) {
		return NextResponse.json(
			{
				error: "Failed to update module",
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

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const auth = await requireAdminSupabase(request);
	if ("error" in auth) {
		return auth.error;
	}

	const { id } = await params;
	const { supabase } = auth;
	const { error } = await supabase.from("learning_modules").delete().eq("id", id);

	if (error) {
		return NextResponse.json(
			{
				error: "Failed to delete module",
				details: error.message,
			},
			{ status: 500 },
		);
	}

	return NextResponse.json({ success: true });
}
