"use client";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { artifactApi } from "@/entities/artifact/api/artifact-api";
import { artifactQueryKeys } from "@/entities/artifact/api/query-keys";
import type { Artifact } from "@/entities/artifact/model/types";
import { DataTable } from "@/widgets/data-table/ui/data-table";

const columns: ColumnDef<Artifact>[] = [
  { accessorKey: "title", header: "Название" },
  { accessorKey: "inventoryNumber", header: "Инв. №" },
  { accessorKey: "updatedAt", header: "Обновлено" },
];

export function ArtifactsPage() {
  const { data, isLoading } = useQuery({
    queryKey: artifactQueryKeys.list({ page: 1 }),
    queryFn: () => artifactApi.list({ page: 1 }),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Экспонаты</h1>
      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
}
