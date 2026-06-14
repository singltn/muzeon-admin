"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { z } from "zod";
import { DataTable } from "@/widgets/data-table/ui/data-table";
import { PageHeader } from "@/shared/ui/page-header";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { EmptyState } from "@/shared/ui/empty-state";
import { eventTypeApi } from "@/entities/event-type/api/event-type-api";
import { eventTypeQueryKeys } from "@/entities/event-type/api/query-keys";
import type { EventType } from "@/entities/event-type/model/types";
import { toastApiError, toastSuccess } from "@/shared/lib/toast";

const schema = z.object({ name: z.string().min(1, "Обязательно") });
type FormData = z.infer<typeof schema>;

export function EventTypesPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<EventType | null>(null);
  const [deleteItem, setDeleteItem] = useState<EventType | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: eventTypeQueryKeys.list(),
    queryFn: eventTypeApi.list,
  });

  const createMutation = useMutation({
    mutationFn: (d: FormData) => eventTypeApi.create(d),
    onSuccess: () => {
      toastSuccess("Тип создан");
      queryClient.invalidateQueries({ queryKey: eventTypeQueryKeys.all });
      setFormOpen(false);
    },
    onError: toastApiError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, d }: { id: number; d: FormData }) =>
      eventTypeApi.update(id, d),
    onSuccess: () => {
      toastSuccess("Тип обновлён");
      queryClient.invalidateQueries({ queryKey: eventTypeQueryKeys.all });
      setEditItem(null);
    },
    onError: toastApiError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => eventTypeApi.remove(id),
    onSuccess: () => {
      toastSuccess("Тип удалён");
      queryClient.invalidateQueries({ queryKey: eventTypeQueryKeys.all });
      setDeleteItem(null);
    },
    onError: toastApiError,
  });

  const columns: ColumnDef<EventType, unknown>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (info) => <span className="text-muted-foreground">{String(info.getValue())}</span>,
    },
    {
      accessorKey: "name",
      header: "Название",
      cell: (info) => <span className="font-medium">{String(info.getValue())}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setEditItem(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteItem(row.original)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Типы событий"
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Создать тип
          </Button>
        }
      />

      {!isLoading && (data ?? []).length === 0 ? (
        <EmptyState
          icon={Tag}
          title="Типов событий ещё нет"
          action={<Button onClick={() => setFormOpen(true)}>Создать</Button>}
        />
      ) : (
        <DataTable columns={columns} data={data ?? []} isLoading={isLoading} />
      )}

      <TypeFormModal
        open={formOpen || !!editItem}
        onOpenChange={(v) => {
          if (!v) { setFormOpen(false); setEditItem(null); }
        }}
        initialData={editItem ?? undefined}
        onSubmit={(d) =>
          editItem
            ? updateMutation.mutate({ id: editItem.id, d })
            : createMutation.mutate(d)
        }
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(v) => !v && setDeleteItem(null)}
        title="Удалить тип"
        description={`Удалить тип «${deleteItem?.name}»? Если тип используется — получите ошибку.`}
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}

function TypeFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData?: EventType;
  onSubmit: (d: FormData) => void;
  isPending: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: initialData?.name ?? "" },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{initialData ? "Редактировать тип" : "Создать тип"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Название</Label>
            <Input {...register("name")} aria-invalid={!!errors.name} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Сохранение…" : "Сохранить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
