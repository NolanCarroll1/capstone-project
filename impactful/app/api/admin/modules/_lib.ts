import { type NextRequest, NextResponse } from "next/server";

import type { LearningModule, LearningModuleStatus } from "@/lib/admin/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfileRole = "user" | "admin";

type ProfileRow = {
	id: string;
	role: ProfileRole | null;
};

type ModuleRow = {
	id: string;
	slug: string | null;
	title: string | null;
	status: string | null;
	created_at: string | null;
	updated_at: string | null;
	data: LearningModule | null;
};

export function getBearerToken(request: NextRequest) {
	const authorization = request.headers.get("authorization");
	if (!authorization) {
		return null;
	}

	const [scheme, token] = authorization.split(" ");
	if (scheme?.toLowerCase() !== "bearer" || !token) {
		return null;
	}

	return token;
}

export async function requireAdminSupabase(request: NextRequest) {
	const token = getBearerToken(request);
	if (!token) {
		return {
			error: NextResponse.json({ error: "Missing bearer token" }, { status: 401 }),
		};
	}

	const supabase = createSupabaseServerClient(token);
	const { data: userData, error: userError } = await supabase.auth.getUser(token);
	if (userError || !userData.user) {
		return {
			error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
		};
	}

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("id, role")
		.eq("id", userData.user.id)
		.maybeSingle<ProfileRow>();

	if (profileError) {
		return {
			error: NextResponse.json(
				{
					error: "Failed to resolve user profile",
					details: profileError.message,
				},
				{ status: 500 },
			),
		};
	}

	if (!profile || profile.role !== "admin") {
		return {
			error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
		};
	}

	return { supabase, user: userData.user };
}

export function normalizeModule(inputModule: LearningModule): LearningModule {
	const nextStatus: LearningModuleStatus = inputModule.status === "published" ? "published" : "draft";
	const now = new Date().toISOString();

	return {
		...inputModule,
		status: nextStatus,
		createdAt: inputModule.createdAt || now,
		updatedAt: now,
	};
}

export function parseLearningModule(body: unknown): LearningModule | null {
	if (!body || typeof body !== "object") {
		return null;
	}

	const inputModule = body as Partial<LearningModule>;
	if (
		typeof inputModule.id !== "string" ||
		typeof inputModule.title !== "string" ||
		typeof inputModule.slug !== "string" ||
		typeof inputModule.description !== "string" ||
		typeof inputModule.introduction !== "string" ||
		typeof inputModule.tutorial !== "string" ||
		typeof inputModule.estimatedMinutes !== "number" ||
		(inputModule.status !== "draft" && inputModule.status !== "published") ||
		!Array.isArray(inputModule.phases)
	) {
		return null;
	}

	return inputModule as LearningModule;
}

export function moduleFromRow(row: ModuleRow): LearningModule | null {
	if (!row.data) {
		return null;
	}

	return row.data;
}

export function moduleToRow(inputModule: LearningModule, ownerId: string) {
	return {
		id: inputModule.id,
		slug: inputModule.slug,
		title: inputModule.title,
		status: inputModule.status,
		data: {
			...inputModule,
			ownerId,
		},
	};
}
