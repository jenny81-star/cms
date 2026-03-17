import { z } from 'zod'

export const LoginSchema = z.object({
  username: z
    .string()
    .min(1, '사용자명을 입력하세요')
    .min(3, '사용자명은 최소 3자 이상이어야 합니다'),
  password: z
    .string()
    .min(1, '비밀번호를 입력하세요')
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
})

export type LoginFormData = z.infer<typeof LoginSchema>
