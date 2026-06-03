import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/50 p-6">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium text-primary">Музейная платформа монетизации</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Панель управления
        </h1>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-base">Вход в систему</CardTitle>
          <CardDescription>
            Используйте корпоративный email и пароль
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
