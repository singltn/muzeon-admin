"use client";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { userApi } from "@/entities/user/api/user-api";
import { userQueryKeys } from "@/entities/user/api/query-keys";
import type { User } from "@/entities/user/model/types";
import { DataTable } from "@/widgets/data-table/ui/data-table";

const columns: ColumnDef<User>[] = [
  { accessorKey: "displayName", header: "Имя" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "roles",
    header: "Роли",
    cell: ({ row }) => row.original.roles.join(", "),
  },
];

export function UsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: userQueryKeys.list({ page: 1 }),
    queryFn: () => userApi.list({ page: 1 }),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Пользователи</h1>
      <DataTable data={data?.data ?? []} columns={columns} isLoading={isLoading} />
    </div>
  );
}
