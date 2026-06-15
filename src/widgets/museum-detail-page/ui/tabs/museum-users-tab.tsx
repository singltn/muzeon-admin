"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { ActiveBadge } from "@/shared/ui/status-badge";
import { userApi } from "@/entities/user/api/user-api";
import { userQueryKeys } from "@/entities/user/api/query-keys";
import {
  userCreateSchema,
  userUpdateSchema,
  type UserCreateFormData,
  type UserUpdateFormData,
} from "@/entities/user/model/schemas";
import type { User } from "@/entities/user/model/types";
import { toastApiError, toastSuccess } from "@/shared/lib/toast";
import { ROLE_LABELS } from "@/shared/lib/rbac/types";

const ROLE_OPTIONS = [
  { value: "museum_admin", label: ROLE_LABELS.museum_admin },
  { value: "museum_stuff", label: ROLE_LABELS.museum_stuff },
] as const;

export function MuseumUsersTab({ museumId }: { museumId: number }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: userQueryKeys.list(museumId, {
      offset: page * PAGE_SIZE,
      limit: PAGE_SIZE,
    }),
    queryFn: () =>
      userApi.list(museumId, { offset: page * PAGE_SIZE, limit: PAGE_SIZE }),
  });

  const createMutation = useMutation({
    mutationFn: (body: UserCreateFormData) => userApi.create(museumId, body),
    onSuccess: (user) => {
      toastSuccess(`Пользователь создан, пароль отправлен на ${user.email}`);
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      setCreateOpen(false);
    },
    onError: toastApiError,
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: number) => userApi.remove(museumId, userId),
    onSuccess: () => {
      toastSuccess("Пользователь удалён");
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      setDeleteUser(null);
    },
    onError: toastApiError,
  });

  const columns: ColumnDef<User, unknown>[] = [
    {
      id: "name",
      header: "Имя",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.first_name} {row.original.last_name}
        </span>
      ),
    },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role",
      header: "Роль",
      cell: (info) =>
        ROLE_LABELS[info.getValue() as keyof typeof ROLE_LABELS] ??
        String(info.getValue()),
    },
    {
      accessorKey: "is_active",
      header: "Статус",
      cell: (info) => <ActiveBadge isActive={Boolean(info.getValue())} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditUser(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteUser(row.original)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Создать пользователя
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        total={data?.total ?? 0}
        page={page}
        onPageChange={setPage}
      />

      <UserCreateModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={createMutation.mutate}
        isPending={createMutation.isPending}
        roleOptions={ROLE_OPTIONS}
      />

      {editUser && (
        <UserEditModal
          open
          onOpenChange={() => setEditUser(null)}
          user={editUser}
          museumId={museumId}
          roleOptions={ROLE_OPTIONS}
        />
      )}

      <ConfirmDialog
        open={!!deleteUser}
        onOpenChange={(v) => !v && setDeleteUser(null)}
        title="Удалить пользователя"
        description={`Удалить ${deleteUser?.email}?`}
        onConfirm={() => deleteUser && deleteMutation.mutate(deleteUser.id)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}

function UserCreateModal({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  roleOptions,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (d: UserCreateFormData) => void;
  isPending: boolean;
  roleOptions: readonly { value: string; label: string }[];
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCreateFormData>({ resolver: zodResolver(userCreateSchema) });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать пользователя</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Email" error={errors.email?.message}>
            <Input {...register("email")} type="email" aria-invalid={!!errors.email} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Имя" error={errors.first_name?.message}>
              <Input {...register("first_name")} aria-invalid={!!errors.first_name} />
            </Field>
            <Field label="Фамилия" error={errors.last_name?.message}>
              <Input {...register("last_name")} aria-invalid={!!errors.last_name} />
            </Field>
          </div>
          <Field label="Роль" error={errors.role?.message}>
            <select
              {...register("role")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">— выберите роль —</option>
              {roleOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <p className="text-xs text-muted-foreground">
            Пароль будет автоматически отправлен на email
          </p>
          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Создание…" : "Создать"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UserEditModal({
  open,
  onOpenChange,
  user,
  museumId,
  roleOptions,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: User;
  museumId: number;
  roleOptions: readonly { value: string; label: string }[];
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdateFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role as UserUpdateFormData["role"],
      is_active: user.is_active,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (d: UserUpdateFormData) =>
      userApi.update(museumId, user.id, d),
    onSuccess: () => {
      toastSuccess("Пользователь обновлён");
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      onOpenChange(false);
    },
    onError: toastApiError,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать пользователя</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((d) => updateMutation.mutate(d))}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Имя" error={errors.first_name?.message}>
              <Input
                {...register("first_name")}
                aria-invalid={!!errors.first_name}
              />
            </Field>
            <Field label="Фамилия" error={errors.last_name?.message}>
              <Input
                {...register("last_name")}
                aria-invalid={!!errors.last_name}
              />
            </Field>
          </div>
          <Field label="Роль" error={errors.role?.message}>
            <select
              {...register("role")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {roleOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Статус">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("is_active")}
                id="is_active"
                className="h-4 w-4"
              />
              <Label htmlFor="is_active">Учётная запись активна</Label>
            </div>
          </Field>
          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Сохранение…" : "Сохранить"}
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
