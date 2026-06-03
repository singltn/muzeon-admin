"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Download, Filter, Plus } from "lucide-react";
import { exhibitionApi } from "@/entities/exhibition/api/exhibition-api";
import { exhibitionQueryKeys } from "@/entities/exhibition/api/query-keys";
import type { Exhibition } from "@/entities/exhibition/model/types";
import { DataTable } from "@/widgets/data-table/ui/data-table";
import { PermissionGate } from "@/features/rbac/permission-gate/ui/permission-gate";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";
import { ContentTypeLabel } from "@/shared/ui/content-type-label";
import { formatDate, formatNumber, formatRub } from "@/shared/lib/format";

const columns: ColumnDef<Exhibition>[] = [
  {
    accessorKey: "title",
    header: "Название",
    cell: ({ row }) => (
      <Link
        href={`/exhibitions/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "type",
    header: "Тип",
    cell: ({ row }) => <ContentTypeLabel type={row.original.type} />,
  },
  {
    accessorKey: "startsAt",
    header: "Дата",
    cell: ({ row }) => formatDate(row.original.startsAt),
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "ticketsSold",
    header: "Билеты",
    cell: ({ row }) =>
      row.original.ticketsSold != null
        ? formatNumber(row.original.ticketsSold)
        : "—",
  },
  {
    accessorKey: "revenueRub",
    header: "Доход",
    cell: ({ row }) =>
      row.original.revenueRub != null
        ? formatRub(row.original.revenueRub)
        : "—",
  },
];

export function ExhibitionsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: exhibitionQueryKeys.list({ page }),
    queryFn: () => exhibitionApi.list({ page }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">События</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Выставки, лекции, мастер-классы и экскурсии
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
            Фильтр
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Экспорт
          </Button>
          <PermissionGate permission="exhibitions:write">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Добавить
            </Button>
          </PermissionGate>
        </div>
      </div>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        page={data?.meta.page ?? page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
