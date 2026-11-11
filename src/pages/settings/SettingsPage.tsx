import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { User, Palette, ShieldAlert } from 'lucide-react'

export function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
        <p className="text-muted-foreground mt-1">
          Управляйте своим профилем, внешним видом и безопасностью аккаунта.
        </p>
      </div>

      {/* Вкладки */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Профиль</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Внешний вид</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            <span className="hidden sm:inline">Аккаунт</span>
          </TabsTrigger>
        </TabsList>

        {/* Контент вкладок (пока с заглушками) */}
        <TabsContent value="profile">
          <div className="border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Профиль</h2>
            <p className="text-muted-foreground">Здесь будет форма изменения имени.</p>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Внешний вид</h2>
            <p className="text-muted-foreground">Здесь будет выбор темы.</p>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Аккаунт</h2>
            <p className="text-muted-foreground">Здесь будет кнопка выхода из системы.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}