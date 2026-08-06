import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { LearningModule } from "./types";

/**
 * Helper: get bearer token from Supabase client session
 */
async function getAccessToken(): Promise<string | null> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token ?? null;
    return token;
  } catch (e) {
    console.warn("Failed to read supabase session for server API", e);
    return null;
  }
}

async function callApi(path: string, opts: RequestInit = {}) {
  const token = await getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> | undefined),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(path, { ...opts, headers, credentials: "same-origin" });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err = new Error(`API ${path} failed: ${res.status} ${res.statusText} ${body}`);
    (err as any).response = res;
    throw err;
  }
  return res.json().catch(() => ({}));
}

export async function apiListModules(): Promise<LearningModule[]> {
  const data = await callApi("/api/admin/modules", { method: "GET" });
  return data?.modules ?? [];
}

export async function apiGetModule(id: string): Promise<LearningModule | null> {
  const data = await callApi(`/api/admin/modules/${encodeURIComponent(id)}`, { method: "GET" });
  return data?.module ?? null;
}

export async function apiSaveModule(module: LearningModule): Promise<LearningModule | undefined> {
  const payload = await callApi("/api/admin/modules", {
    method: "POST",
    body: JSON.stringify(module),
  });
  return payload?.module;
}

export async function apiUpdateModule(id: string, module: LearningModule): Promise<LearningModule | undefined> {
  const payload = await callApi(`/api/admin/modules/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(module),
  });
  return payload?.module;
}

export async function apiDeleteModule(id: string): Promise<void> {
  await callApi(`/api/admin/modules/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function apiSetModuleStatus(id: string, status: "draft" | "published"): Promise<LearningModule | undefined> {
  const payload = await callApi(`/api/admin/modules/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return payload?.module;
}
