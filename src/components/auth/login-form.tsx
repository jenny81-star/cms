'use client'

// 관리자 로그인 폼 컴포넌트 - React Hook Form + Zod 유효성 검사
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, LogIn, ShieldAlert } from 'lucide-react'

import { LoginSchema, type LoginFormData } from '@/lib/schemas/auth'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// 로그인 요청 응답 상태 타입
interface LoginState {
  error: string | null
  rateLimited: boolean
  remainingAttempts: number | null
}

export function LoginForm() {
  const router = useRouter()

  // 제출 중 로딩 상태
  const [isPending, setIsPending] = useState(false)

  // 비밀번호 표시/숨김 상태
  const [showPassword, setShowPassword] = useState(false)

  // 로그인 오류 및 제한 상태
  const [loginState, setLoginState] = useState<LoginState>({
    error: null,
    rateLimited: false,
    remainingAttempts: null,
  })

  // React Hook Form 초기화 - Zod 스키마로 유효성 검사
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  // 폼 제출 핸들러
  // TODO: POST /api/auth/login 요청 후 응답 처리 로직 구현 필요
  async function onSubmit(data: LoginFormData) {
    setIsPending(true)
    setLoginState({ error: null, rateLimited: false, remainingAttempts: null })

    try {
      // TODO: 실제 로그인 API 호출 구현
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.status === 429) {
        // TODO: 로그인 시도 제한 처리 구현
        setLoginState({
          error: result.message || '로그인 시도 횟수를 초과했습니다.',
          rateLimited: true,
          remainingAttempts: result.remainingAttempts ?? null,
        })
        return
      }

      if (!response.ok) {
        // TODO: 로그인 실패 오류 메시지 처리 구현
        setLoginState({
          error: result.message || '아이디 또는 비밀번호가 올바르지 않습니다.',
          rateLimited: false,
          remainingAttempts: result.remainingAttempts ?? null,
        })
        return
      }

      // TODO: 로그인 성공 시 관리자 대시보드로 리다이렉트
      router.push('/admin')
      router.refresh()
    } catch {
      // TODO: 네트워크 오류 처리 구현
      setLoginState({
        error: '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
        rateLimited: false,
        remainingAttempts: null,
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-semibold">로그인</CardTitle>
        <CardDescription className="text-sm">
          관리자 계정으로 로그인하세요
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 로그인 오류 알림 영역 */}
        {loginState.error && (
          <Alert
            variant="destructive"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>
              {loginState.rateLimited ? '로그인 제한' : '로그인 실패'}
            </AlertTitle>
            <AlertDescription className="space-y-1">
              <p>{loginState.error}</p>
              {/* 남은 시도 횟수 표시 */}
              {loginState.remainingAttempts !== null &&
                !loginState.rateLimited && (
                  <p className="text-destructive/80 text-xs">
                    남은 시도 횟수: {loginState.remainingAttempts}회
                  </p>
                )}
            </AlertDescription>
          </Alert>
        )}

        {/* 로그인 폼 */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            aria-label="관리자 로그인 폼"
            noValidate
          >
            {/* 사용자명 입력 필드 */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username">사용자명</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="username"
                      type="text"
                      placeholder="관리자 아이디를 입력하세요"
                      autoComplete="username"
                      autoFocus
                      disabled={isPending || loginState.rateLimited}
                      aria-required="true"
                      aria-describedby={
                        form.formState.errors.username
                          ? 'username-error'
                          : undefined
                      }
                    />
                  </FormControl>
                  <FormMessage id="username-error" />
                </FormItem>
              )}
            />

            {/* 비밀번호 입력 필드 */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">비밀번호</FormLabel>
                  <FormControl>
                    {/* 비밀번호 표시/숨김 토글이 있는 입력 필드 */}
                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="비밀번호를 입력하세요"
                        autoComplete="current-password"
                        disabled={isPending || loginState.rateLimited}
                        className="pr-10"
                        aria-required="true"
                        aria-describedby={
                          form.formState.errors.password
                            ? 'password-error'
                            : undefined
                        }
                      />
                      {/* 비밀번호 표시/숨김 토글 버튼 */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        disabled={isPending}
                        className={cn(
                          'text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2',
                          'rounded-sm transition-colors',
                          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
                          'disabled:pointer-events-none disabled:opacity-50'
                        )}
                        aria-label={
                          showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                        }
                        aria-pressed={showPassword}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage id="password-error" />
                </FormItem>
              )}
            />

            {/* 로그인 제출 버튼 */}
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || loginState.rateLimited}
              aria-busy={isPending}
              aria-label={isPending ? '로그인 중...' : '로그인'}
            >
              {isPending ? (
                // 로딩 상태: 스피너 + 텍스트
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  로그인 중...
                </>
              ) : (
                // 기본 상태: 로그인 아이콘 + 텍스트
                <>
                  <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                  로그인
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      {/* 로그인 제한 안내 */}
      {loginState.rateLimited && (
        <CardFooter className="pt-0">
          <p className="text-muted-foreground w-full text-center text-xs">
            잠시 후 다시 시도하거나 관리자에게 문의하세요
          </p>
        </CardFooter>
      )}
    </Card>
  )
}
