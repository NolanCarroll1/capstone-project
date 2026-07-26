import { GameScreen } from "../../_screens/GameScreen";

export default async function ModuleGamePage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	return <GameScreen moduleSlug={slug} />;
}