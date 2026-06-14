"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { museumApi } from "@/entities/museum/api/museum-api";
import { museumQueryKeys } from "@/entities/museum/api/query-keys";
import {
  museumUpdateAdminSchema,
  type MuseumUpdateFormData,
} from "@/entities/museum/model/schemas";
import type { Museum } from "@/entities/museum/model/types";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { toastApiError, toastSuccess } from "@/shared/lib/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

type Props = {
  museum: Museum;
  isSuperAdmin?: boolean;
};

export function MuseumProfileTab({ museum, isSuperAdmin }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MuseumUpdateFormData>({
    resolver: zodResolver(museumUpdateAdminSchema),
    defaultValues: {
      name: museum.name,
      legal_name: museum.legal_name,
      inn: museum.inn,
      ogrn: museum.ogrn,
      email: museum.email,
      phone: museum.phone,
      address: museum.address,
      status: museum.status,
      subscription_plan: museum.subscription_plan,
      subscription_end_date: museum.subscription_end_date ?? undefined,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: MuseumUpdateFormData) =>
      museumApi.update(museum.id, data),
    onSuccess: () => {
      toastSuccess("Музей обновлён");
      queryClient.invalidateQueries({
        queryKey: museumQueryKeys.detail(museum.id),
      });
    },
    onError: toastApiError,
  });

  return (
    <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))}>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Информация о музее</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Название" error={errors.name?.message}>
            <Input {...register("name")} aria-invalid={!!errors.name} />
          </Field>
          <Field label="Юридическое название" error={errors.legal_name?.message}>
            <Input {...register("legal_name")} aria-invalid={!!errors.legal_name} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ИНН" error={errors.inn?.message}>
              <Input {...register("inn")} aria-invalid={!!errors.inn} />
            </Field>
            <Field label="ОГРН" error={errors.ogrn?.message}>
              <Input {...register("ogrn")} aria-invalid={!!errors.ogrn} />
            </Field>
          </div>
          <Field label="Email" error={errors.email?.message}>
            <Input {...register("email")} type="email" aria-invalid={!!errors.email} />
          </Field>
          <Field label="Телефон" error={errors.phone?.message}>
            <Input {...register("phone")} aria-invalid={!!errors.phone} />
          </Field>
          <Field label="Адрес" error={errors.address?.message}>
            <Input {...register("address")} aria-invalid={!!errors.address} />
          </Field>

          {isSuperAdmin && (
            <>
              <Field label="Статус" error={errors.status?.message}>
                <select
                  {...register("status")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="trial">Пробный</option>
                  <option value="active">Активен</option>
                  <option value="inactive">Неактивен</option>
                  <option value="blocked">Заблокирован</option>
                </select>
              </Field>
              <Field label="Тарифный план" error={errors.subscription_plan?.message}>
                <select
                  {...register("subscription_plan")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
              </Field>
              <Field label="Дата окончания подписки">
                <Input
                  {...register("subscription_end_date")}
                  type="date"
                />
              </Field>
            </>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Сохранение…" : "Сохранить"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
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
