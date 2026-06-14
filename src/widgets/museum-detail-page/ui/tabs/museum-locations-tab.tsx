"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
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
import { ActiveBadge } from "@/shared/ui/status-badge";
import { locationApi } from "@/entities/location/api/location-api";
import { locationQueryKeys } from "@/entities/location/api/query-keys";
import {
  locationSchema,
  type LocationFormData,
} from "@/entities/location/model/schemas";
import type { EventLocation } from "@/entities/location/model/types";
import { toastApiError, toastSuccess } from "@/shared/lib/toast";

export function MuseumLocationsTab({
  museumId,
  canManage = false,
}: {
  museumId: number;
  canManage?: boolean;
}) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<EventLocation | null>(null);
  const [deleteItem, setDeleteItem] = useState<EventLocation | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: locationQueryKeys.list(museumId, { offset: page * PAGE_SIZE, limit: PAGE_SIZE }),
    queryFn: () =>
      locationApi.list(museumId, { offset: page * PAGE_SIZE, limit: PAGE_SIZE }),
  });

  const createMutation = useMutation({
    mutationFn: (body: LocationFormData) =>
      locationApi.create(museumId, {
        name: body.name,
        description: body.description ?? null,
        address: body.address,
        city: body.city ?? null,
        country: body.country ?? null,
        latitude: body.latitude ?? null,
        longitude: body.longitude ?? null,
        is_active: body.is_active,
      }),
    onSuccess: () => {
      toastSuccess("Площадка создана");
      queryClient.invalidateQueries({ queryKey: locationQueryKeys.all });
      setFormOpen(false);
    },
    onError: toastApiError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: LocationFormData }) =>
      locationApi.update(museumId, id, {
        name: body.name,
        description: body.description ?? null,
        address: body.address,
        city: body.city ?? null,
        country: body.country ?? null,
        latitude: body.latitude ?? null,
        longitude: body.longitude ?? null,
        is_active: body.is_active,
      }),
    onSuccess: () => {
      toastSuccess("Площадка обновлена");
      queryClient.invalidateQueries({ queryKey: locationQueryKeys.all });
      setEditItem(null);
    },
    onError: toastApiError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => locationApi.remove(museumId, id),
    onSuccess: () => {
      toastSuccess("Площадка удалена");
      queryClient.invalidateQueries({ queryKey: locationQueryKeys.all });
      setDeleteItem(null);
    },
    onError: toastApiError,
  });

  const columns: ColumnDef<EventLocation, unknown>[] = [
    {
      accessorKey: "name",
      header: "Название",
      cell: (info) => <span className="font-medium">{String(info.getValue())}</span>,
    },
    { accessorKey: "address", header: "Адрес" },
    { accessorKey: "city", header: "Город" },
    {
      accessorKey: "is_active",
      header: "Статус",
      cell: (info) => <ActiveBadge isActive={Boolean(info.getValue())} />,
    },
    ...(canManage
      ? [
          {
            id: "actions",
            header: "",
            cell: ({ row }: { row: { original: EventLocation } }) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setEditItem(row.original)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteItem(row.original)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ),
          } as ColumnDef<EventLocation, unknown>,
        ]
      : []),
  ];

  return (
    <div>
      {canManage && (
        <div className="mb-4 flex justify-end">
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить площадку
          </Button>
        </div>
      )}

      {!isLoading && (data?.items ?? []).length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Площадок ещё нет"
          description={canManage ? "Создайте первую площадку" : undefined}
          action={
            canManage ? (
              <Button onClick={() => setFormOpen(true)}>Создать</Button>
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

      <LocationFormModal
        open={formOpen || !!editItem}
        onOpenChange={(v) => {
          if (!v) {
            setFormOpen(false);
            setEditItem(null);
          }
        }}
        initialData={editItem ?? undefined}
        onSubmit={(d) => {
          if (editItem) {
            updateMutation.mutate({ id: editItem.id, body: d });
          } else {
            createMutation.mutate(d);
          }
        }}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(v) => !v && setDeleteItem(null)}
        title="Удалить площадку"
        description={`Вы уверены, что хотите удалить «${deleteItem?.name}»?`}
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}

function LocationFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData?: EventLocation;
  onSubmit: (d: LocationFormData) => void;
  isPending: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<LocationFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(locationSchema) as any,
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description ?? undefined,
          address: initialData.address,
          city: initialData.city ?? undefined,
          country: initialData.country ?? undefined,
          latitude: initialData.latitude ?? undefined,
          longitude: initialData.longitude ?? undefined,
          is_active: initialData.is_active,
        }
      : { is_active: true },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Редактировать площадку" : "Создать площадку"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Название" error={errors.name?.message}>
            <Input {...register("name")} aria-invalid={!!errors.name} />
          </Field>
          <Field label="Описание" error={errors.description?.message}>
            <Input {...register("description")} />
          </Field>
          <Field label="Адрес" error={errors.address?.message}>
            <Input {...register("address")} aria-invalid={!!errors.address} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Город">
              <Input {...register("city")} />
            </Field>
            <Field label="Страна">
              <Input {...register("country")} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Широта">
              <Input {...register("latitude")} type="number" step="any" />
            </Field>
            <Field label="Долгота">
              <Input {...register("longitude")} type="number" step="any" />
            </Field>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("is_active")} id="loc_active" className="h-4 w-4" />
            <Label htmlFor="loc_active">Площадка активна</Label>
          </div>
          <div className="flex justify-end gap-3 pt-1">
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
