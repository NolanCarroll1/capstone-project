import { ModuleEditorForm } from "@/app/admin/_components/ModuleEditorForm";

export default async function AdminEditModulePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <ModuleEditorForm mode="edit" moduleId={id} />;
}
