"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Trash2, CalendarDays, Pencil } from "lucide-react";
import { DataTable, PAGE_SIZE } from "@/widgets/data-table/ui/data-table";
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
import { EventStatusBadge } from "@/shared/ui/status-badge";
import { eventApi } from "@/entities/event/api/event-api";
import { eventQueryKeys } from "@/entities/event/api/query-keys";
import { eventTypeApi } from "@/entities/event-type/api/event-type-api";
import { eventTypeQueryKeys } from "@/entities/event-type/api/query-keys";
import { locationApi } from "@/entities/location/api/location-api";
import { locationQueryKeys } from "@/entities/location/api/query-keys";
import {
  eventCreateSchema,
  type EventCreateFormData,
} from "@/entities/event/model/schemas";
import type { Event, EventStatus } from "@/entities/event/model/types";
import { EVENT_STATUS_TRANSITIONS } from "@/entities/event/model/types";
import { toastApiError, toastSuccess } from "@/shared/lib/toast";
import { Textarea } from "@/shared/ui/textarea";
import { formatDatetime, toDatetimeLocal } from "@/shared/lib/format-date";

const statusLabels: Record<EventStatus, string> = {
  draft: "Черновик",
  published: "Опубликовано",
  archived: "Архив",
  canceled: "Отменено",
};

export function MuseumEventsTab({
  museumId,
  canManage = false,
}: {
  museumId: number;
  canManage?: boolean;
}) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Event | null>(null);
  const [deleteItem, setDeleteItem] = useState<Event | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: eventQueryKeys.list(museumId, { offset: page * PAGE_SIZE, limit: PAGE_SIZE }),
    queryFn: () => eventApi.list(museumId, { offset: page * PAGE_SIZE, limit: PAGE_SIZE }),
  });

  const createMutation = useMutation({
    mutationFn: (body: EventCreateFormData) =>
      eventApi.create(museumId, { ...body, date_end: body.date_end ?? null }),
    onSuccess: () => {
      toastSuccess("Событие создано");
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all });
      setCreateOpen(false);
    },
    onError: toastApiError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: EventCreateFormData }) =>
      eventApi.update(museumId, id, { ...body, date_end: body.date_end ?? null }),
    onSuccess: () => {
      toastSuccess("Событие обновлено");
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all });
      setEditItem(null);
    },
    onError: toastApiError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => eventApi.remove(museumId, id),
    onSuccess: () => {
      toastSuccess("Событие удалено");
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all });
      setDeleteItem(null);
    },
    onError: toastApiError,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: EventStatus }) =>
      eventApi.update(museumId, id, { status }),
    onSuccess: () => {
      toastSuccess("Статус обновлён");
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all });
    },
    onError: toastApiError,
  });

  const columns: ColumnDef<Event, unknown>[] = [
    {
      accessorKey: "title",
      header: "Название",
      cell: (info) => <span className="font-medium">{String(info.getValue())}</span>,
    },
    {
      accessorKey: "date_start",
      header: "Дата",
      cell: (info) => (
        <span className="whitespace-nowrap text-sm">
          {formatDatetime(String(info.getValue()))}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => {
        const status = row.original.status;
        const transitions = EVENT_STATUS_TRANSITIONS[status];
        if (!canManage || transitions.length === 0) {
          return <EventStatusBadge status={status} />;
        }
        return (
          <select
            defaultValue={status}
            className="rounded border border-input bg-background px-2 py-1 text-xs"
            onChange={(e) =>
              statusMutation.mutate({ id: row.original.id, status: e.target.value as EventStatus })
            }
          >
            <option value={status}>{statusLabels[status]}</option>
            {transitions.map((t) => (
              <option key={t} value={t}>{statusLabels[t]}</option>
            ))}
          </select>
        );
      },
    },
    ...(canManage
      ? [
          {
            id: "actions",
            header: "",
            cell: ({ row }: { row: { original: Event } }) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setEditItem(row.original)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteItem(row.original)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ),
          } as ColumnDef<Event, unknown>,
        ]
      : []),
  ];

  return (
    <div>
      {canManage && (
        <div className="mb-4 flex justify-end">
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Создать событие
          </Button>
        </div>
      )}

      {!isLoading && (data?.items ?? []).length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Событий ещё нет"
          description={canManage ? "Создайте первое событие" : undefined}
          action={
            canManage ? (
              <Button onClick={() => setCreateOpen(true)}>Создать</Button>
            ) : undefined
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          total={data?.total ?? 0}
          page={page}
          onPageChange={setPage}
        />
      )}

      {/* Create modal */}
      <EventFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        museumId={museumId}
        onSubmit={createMutation.mutate}
        isPending={createMutation.isPending}
      />

      {/* Edit modal */}
      {editItem && (
        <EventFormModal
          open
          onOpenChange={(v) => !v && setEditItem(null)}
          museumId={museumId}
          initialData={editItem}
          onSubmit={(body) => updateMutation.mutate({ id: editItem.id, body })}
          isPending={updateMutation.isPending}
        />
      )}

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(v) => !v && setDeleteItem(null)}
        title="Удалить событие"
        description={`Удалить «${deleteItem?.title}»?`}
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}

function EventFormModal({
  open,
  onOpenChange,
  museumId,
  initialData,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  museumId: number;
  initialData?: Event;
  onSubmit: (d: EventCreateFormData) => void;
  isPending: boolean;
}) {
  const { data: types } = useQuery({
    queryKey: eventTypeQueryKeys.list(),
    queryFn: eventTypeApi.list,
  });

  const { data: locations } = useQuery({
    queryKey: locationQueryKeys.list(museumId, { limit: 100 }),
    queryFn: () => locationApi.list(museumId, { limit: 100 }),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<EventCreateFormData>({
    resolver: zodResolver(eventCreateSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          capacity: initialData.capacity,
          date_start: toDatetimeLocal(initialData.date_start),
          date_end: toDatetimeLocal(initialData.date_end) || undefined,
          type_id: initialData.type_id,
          location_id: initialData.location_id,
          is_recurring: initialData.is_recurring,
        }
      : { is_recurring: false, capacity: 0 },
  });

  const noLocations = (locations?.items ?? []).length === 0;
  const isEdit = !!initialData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Редактировать событие" : "Создать событие"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Название" error={errors.title?.message}>
            <Input {...register("title")} aria-invalid={!!errors.title} />
          </Field>
          <Field label="Описание" error={errors.description?.message}>
            <Textarea {...register("description")} rows={3} aria-invalid={!!errors.description} />
          </Field>
          <Field label="Вместимость" error={errors.capacity?.message}>
            <Input {...register("capacity")} type="number" min={0} aria-invalid={!!errors.capacity} />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Дата начала" error={errors.date_start?.message}>
              <Input {...register("date_start")} type="datetime-local" aria-invalid={!!errors.date_start} />
            </Field>
            <Field label="Дата окончания">
              <Input {...register("date_end")} type="datetime-local" />
            </Field>
          </div>
          <Field label="Тип события" error={errors.type_id?.message}>
            <select
              {...register("type_id")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">— выберите тип —</option>
              {(types ?? []).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Площадка" error={errors.location_id?.message}>
            {noLocations ? (
              <p className="text-sm text-muted-foreground">Сначала создайте площадку</p>
            ) : (
              <select
                {...register("location_id")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">— выберите площадку —</option>
                {(locations?.items ?? []).map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            )}
          </Field>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("is_recurring")} id="is_recurring" className="h-4 w-4" />
            <Label htmlFor="is_recurring">Повторяющееся событие</Label>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
            <Button type="submit" disabled={isPending || (!isEdit && noLocations)}>
              {isPending ? "Сохранение…" : isEdit ? "Сохранить" : "Создать"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
