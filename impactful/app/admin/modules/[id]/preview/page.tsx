import { ModulePreviewPanel } from "@/app/admin/_components/ModulePreviewPanel";

export default async function AdminModulePreviewPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <ModulePreviewPanel moduleId={id} />;
}
