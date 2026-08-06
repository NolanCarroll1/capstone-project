import { type NextRequest, NextResponse } from "next/server";

import type { LearningModule } from "@/lib/admin/types";

import {
	moduleFromRow,
	moduleToRow,
	normalizeModule,
	parseLearningModule,
	requireAdminSupabase,
} from "./_lib";

type ModuleRow = {
	id: string;
	slug: string | null;
	title: string | null;
	status: string | null;
	created_at: string | null;
	updated_at: string | null;
	data: LearningModule | null;
};

export async function GET(request: NextRequest) {
	const auth = await requireAdminSupabase(request);
	if ("error" in auth) {
		return auth.error;
	}

	const { supabase } = auth;
	const { data, error } = await supabase
		.from("learning_modules")
		.select("id, slug, title, status, created_at, updated_at, data")
		.order("updated_at", { ascending: false });

	if (error) {
		return NextResponse.json(
			{
				error: "Failed to fetch modules",
				details: error.message,
			},
			{ status: 500 },
		);
	}

	const modules = (data as ModuleRow[])
		.map((row) => moduleFromRow(row))
		.filter((module): module is LearningModule => module !== null);
	return NextResponse.json({ modules });
}

export async function POST(request: NextRequest) {
	const auth = await requireAdminSupabase(request);
	if ("error" in auth) {
		return auth.error;
	}

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
				error: "Failed to save module",
				details: error.message,
			},
			{ status: 500 },
		);
	}

	const saved = moduleFromRow(data as ModuleRow);
	if (!saved) {
		return NextResponse.json({ error: "Saved module payload missing" }, { status: 500 });
	}

	return NextResponse.json({ module: saved }, { status: 201 });
}
