import { MuseumDetailPage } from "@/widgets/museum-detail-page/ui/museum-detail-page";

export const metadata = { title: "Музей — MUZEON Admin" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MuseumDetailPage museumId={Number(id)} />;
}
