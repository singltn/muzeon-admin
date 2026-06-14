"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, ExternalLink } from "lucide-react";
import { PageHeader } from "@/shared/ui/page-header";
import { Button } from "@/shared/ui/button";
import { DataTable, PAGE_SIZE } from "@/widgets/data-table/ui/data-table";
import { MuseumStatusBadge } from "@/shared/ui/status-badge";
import { museumApi } from "@/entities/museum/api/museum-api";
import { museumQueryKeys } from "@/entities/museum/api/query-keys";
import { toastApiError, toastSuccess } from "@/shared/lib/toast";
import { MuseumFormModal } from "./museum-form-modal";
import type { Museum } from "@/entities/museum/model/types";
import type { MuseumCreateFormData } from "@/entities/museum/model/schemas";

export function MuseumsListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: museumQueryKeys.list({ offset: page * PAGE_SIZE, limit: PAGE_SIZE }),
    queryFn: () => museumApi.list({ offset: page * PAGE_SIZE, limit: PAGE_SIZE }),
  });

  const createMutation = useMutation({
    mutationFn: (body: MuseumCreateFormData) => museumApi.create(body),
    onSuccess: () => {
      toastSuccess("Музей создан");
      queryClient.invalidateQueries({ queryKey: museumQueryKeys.all });
      setModalOpen(false);
    },
    onError: toastApiError,
  });

  const columns: ColumnDef<Museum, unknown>[] = [
    {
      accessorKey: "name",
      header: "Название",
      cell: (info) => (
        <span className="font-medium">{String(info.getValue())}</span>
      ),
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "inn", header: "ИНН" },
    {
      accessorKey: "status",
      header: "Статус",
      cell: (info) => (
        <MuseumStatusBadge status={info.getValue() as Museum["status"]} />
      ),
    },
    {
      accessorKey: "subscription_plan",
      header: "Тариф",
      cell: (info) => (
        <span className="capitalize">{String(info.getValue())}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/museums/${row.original.id}`)}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Музеи"
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Создать музей
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        total={data?.total ?? 0}
        page={page}
        onPageChange={setPage}
      />
      <MuseumFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={createMutation.mutate}
        isPending={createMutation.isPending}
      />
    </div>
  );
}
