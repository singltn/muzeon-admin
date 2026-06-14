"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  museumCreateSchema,
  type MuseumCreateFormData,
} from "@/entities/museum/model/schemas";
import type { Museum } from "@/entities/museum/model/types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData?: Museum;
  onSubmit: (data: MuseumCreateFormData) => void;
  isPending: boolean;
};

export function MuseumFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MuseumCreateFormData>({
    resolver: zodResolver(museumCreateSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          legal_name: initialData.legal_name,
          inn: initialData.inn,
          ogrn: initialData.ogrn,
          email: initialData.email,
          phone: initialData.phone,
          address: initialData.address,
        }
      : {},
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Редактировать музей" : "Создать музей"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Название" error={errors.name?.message}>
            <Input {...register("name")} placeholder="Государственный Эрмитаж" aria-invalid={!!errors.name} />
          </FormField>
          <FormField label="Юридическое название" error={errors.legal_name?.message}>
            <Input {...register("legal_name")} aria-invalid={!!errors.legal_name} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="ИНН" error={errors.inn?.message}>
              <Input {...register("inn")} placeholder="7712345678" aria-invalid={!!errors.inn} />
            </FormField>
            <FormField label="ОГРН" error={errors.ogrn?.message}>
              <Input {...register("ogrn")} placeholder="1234567890123" aria-invalid={!!errors.ogrn} />
            </FormField>
          </div>
          <FormField label="Email" error={errors.email?.message}>
            <Input {...register("email")} type="email" aria-invalid={!!errors.email} />
          </FormField>
          <FormField label="Телефон" error={errors.phone?.message}>
            <Input {...register("phone")} placeholder="79991234567" aria-invalid={!!errors.phone} />
          </FormField>
          <FormField label="Адрес" error={errors.address?.message}>
            <Input {...register("address")} aria-invalid={!!errors.address} />
          </FormField>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Сохранение…" : "Сохранить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
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
