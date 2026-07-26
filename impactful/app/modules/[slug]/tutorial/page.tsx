import { TutorialScreen } from "../../_screens/TutorialScreen";

export default async function ModuleTutorialPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	return <TutorialScreen moduleSlug={slug} />;
}
