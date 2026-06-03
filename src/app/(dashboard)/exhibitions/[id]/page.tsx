import { ExhibitionDetailPage } from "@/widgets/exhibition-detail-page/ui/exhibition-detail-page";

type Props = { params: Promise<{ id: string }> };

export default async function ExhibitionDetailRoutePage({ params }: Props) {
  const { id } = await params;
  return <ExhibitionDetailPage exhibitionId={id} />;
}
