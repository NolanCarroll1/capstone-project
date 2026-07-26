import { StatsScreen } from "../../_screens/StatsScreen";

export default async function ModuleStatsPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams?: Promise<{ trust?: string; revenue?: string; population?: string; choiceCount?: string; }> }) {
	const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams ?? Promise.resolve({})]);
	return <StatsScreen moduleSlug={slug} searchParams={resolvedSearchParams} />;
}