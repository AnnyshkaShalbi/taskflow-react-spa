import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues, useLogin } from '@/entities/user'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { ApiError } from '@/shared/api/http'

// 40px на мобилке — удобно попадать пальцем (базовые h-8 = 32px маловаты), 36px с sm
const fieldClass = 'h-10 sm:h-9'

type LoginFormProps = {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutate, isPending, error } = useLogin()

  const onSubmit = (values: LoginFormValues) => {
    mutate(values, {
      onSuccess: () => {
        onSuccess?.()
      },
    })
  }

  const apiError = error instanceof ApiError ? error.message : null

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  inputMode="email"
                  className={fieldClass}
                  placeholder="anna@taskflow.dev"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className={fieldClass}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {apiError && (
          <p role="alert" className="text-sm text-destructive">{apiError}</p>
        )}

        <Button type="submit" className={`w-full ${fieldClass}`} disabled={isPending}>
          {isPending ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </Form>
  )
}