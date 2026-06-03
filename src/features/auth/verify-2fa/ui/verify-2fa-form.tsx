"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  verify2faSchema,
  type Verify2faFormValues,
} from "../model/schemas";
import { verify2faApi } from "../api/verify-2fa-api";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export function Verify2faForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const challengeId = searchParams.get("challenge") ?? "";

  const form = useForm<Verify2faFormValues>({
    resolver: zodResolver(verify2faSchema),
    defaultValues: { code: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: Verify2faFormValues) =>
      verify2faApi.verify({ challengeId, code: values.code }),
    onSuccess: () => router.push("/"),
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <div className="space-y-2">
        <Label htmlFor="code">Код 2FA</Label>
        <Input
          id="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          {...form.register("code")}
        />
        {form.formState.errors.code && (
          <p className="text-sm text-red-600">
            {form.formState.errors.code.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Проверка…" : "Подтвердить"}
      </Button>
    </form>
  );
}
