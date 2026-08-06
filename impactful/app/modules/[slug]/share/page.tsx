import { ShareResultsScreen } from "../../_screens/ShareResultsScreen";

export default async function ModuleSharePage({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams?: Promise<{ trust?: string; revenue?: string; population?: string; choiceCount?: string }>;
}) {
	const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams ?? Promise.resolve({})]);

	return <ShareResultsScreen moduleSlug={slug} searchParams={resolvedSearchParams} />;
}