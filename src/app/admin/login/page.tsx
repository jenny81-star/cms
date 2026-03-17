// 관리자 로그인 페이지 - 서버 컴포넌트 (메타데이터는 layout.tsx에서 관리)
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    // 로그인 폼 컴포넌트 렌더링
    <LoginForm />
  )
}
