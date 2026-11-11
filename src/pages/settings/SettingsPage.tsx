import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { User, Palette, ShieldAlert } from 'lucide-react'
import { ProfileForm } from '@/features/update-profile'
import { ThemeToggle } from '@/features/theme-toggle'
import { LogoutButton } from '@/features/logout'

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
          <div className="border rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Профиль</h2>
              <p className="text-sm text-muted-foreground">
                Обновите ваше имя. Оно будет отображаться в шапке приложения.
              </p>
            </div>
            <ProfileForm />
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="border rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Внешний вид</h2>
              <p className="text-sm text-muted-foreground">
                Настройте тему интерфейса под себя.
              </p>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Тема оформления</p>
                <p className="text-sm text-muted-foreground">Переключить светлую и тёмную тему</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="border border-destructive/20 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-destructive">Опасная зона</h2>
              <p className="text-sm text-muted-foreground">
                Действия здесь необратимы. Будьте осторожны.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-destructive/30 rounded-lg bg-destructive/5">
              <div>
                <p className="font-medium">Выход из системы</p>
                <p className="text-sm text-muted-foreground">
                  Завершить текущую сессию на этом устройстве
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}