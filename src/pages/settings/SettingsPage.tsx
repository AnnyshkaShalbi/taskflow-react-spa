import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { User, Palette, ShieldAlert } from 'lucide-react'
import { ProfileForm } from '@/features/update-profile'
import { ThemeToggle } from '@/features/theme-toggle'
import { LogoutButton } from '@/features/logout'
import { cn } from 'cn'

// Общие стили секций — чтобы все вкладки выглядели одинаково
const sectionClass = 'border rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6'
const sectionTitleClass = 'text-lg sm:text-xl font-semibold tracking-tight'
const sectionDescriptionClass = 'text-sm text-muted-foreground mt-1'
const rowClass = 'flex justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg'
const rowTitleClass = 'text-sm sm:text-base font-medium'
const rowDescriptionClass = 'text-xs sm:text-sm text-muted-foreground mt-0.5'

export function SettingsPage() {
  return (
    // max-w-4xl (а не 7xl, как на других страницах): формы на всю ширину монитора читаются хуже
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Настройки</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Управляйте своим профилем, внешним видом и безопасностью аккаунта.
        </p>
      </div>

      {/* Вкладки */}
      <Tabs defaultValue="profile" className="w-full">
        {/* mb + встроенный gap-2 у Tabs = 12px / 16px — как шаг сетки на других страницах.
            Высота 40px — как у табов на канбан-доске и удобно для пальца */}
        <TabsList className="grid w-full sm:max-w-md grid-cols-3 group-data-horizontal/tabs:h-10 mb-1 sm:mb-2">
          <TabsTrigger value="profile" className="gap-1.5 text-xs sm:text-sm">
            <User className="h-4 w-4" />
            <span className="truncate">Профиль</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5 text-xs sm:text-sm">
            <Palette className="h-4 w-4" />
            <span className="truncate">Внешний вид</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-1.5 text-xs sm:text-sm">
            <ShieldAlert className="h-4 w-4" />
            <span className="truncate">Аккаунт</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className={sectionClass}>
            <div>
              <h2 className={sectionTitleClass}>Профиль</h2>
              <p className={sectionDescriptionClass}>
                Обновите ваше имя. Оно будет отображаться в шапке приложения.
              </p>
            </div>
            <ProfileForm />
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className={sectionClass}>
            <div>
              <h2 className={sectionTitleClass}>Внешний вид</h2>
              <p className={sectionDescriptionClass}>
                Настройте тему интерфейса под себя.
              </p>
            </div>

            {/* Переключатель темы компактный — даже на мобилке он в одной строке с текстом */}
            <div className={cn(rowClass, 'items-center')}>
              <div className="min-w-0">
                <p className={rowTitleClass}>Тема оформления</p>
                <p className={rowDescriptionClass}>Переключить светлую и тёмную тему</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className={cn(sectionClass, 'border-destructive/20')}>
            <div>
              <h2 className={cn(sectionTitleClass, 'text-destructive')}>Опасная зона</h2>
              <p className={sectionDescriptionClass}>
                Действия здесь необратимы. Будьте осторожны.
              </p>
            </div>

            {/* Кнопка выхода крупная — на мобилке переносим её под текст, на всю ширину */}
            <div className={cn(rowClass, 'flex-col sm:flex-row sm:items-center border-destructive/30 bg-destructive/5')}>
              <div>
                <p className={rowTitleClass}>Выход из системы</p>
                <p className={rowDescriptionClass}>
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
