# 관리자 인증 시스템 가이드

개인 개발 블로그 CMS의 관리자 패널 접근을 위한 인증 시스템 설정 및 사용 가이드입니다.

## 목차

1. [초기 설정](#초기-설정)
2. [로그인](#로그인)
3. [보안 주의사항](#보안-주의사항)
4. [문제 해결](#문제-해결)

---

## 초기 설정

### 1단계: 비밀번호 해시 생성

관리자 비밀번호를 안전하게 저장하기 위해 bcryptjs 해시를 생성합니다.

```bash
# 기본 비밀번호(admin123)로 해시 생성
npx tsx scripts/generate-hash.ts

# 또는 커스텀 비밀번호로 생성
npx tsx scripts/generate-hash.ts "your_secure_password"
```

출력 예시:

```
--------------------------------------
ADMIN_PASSWORD_HASH=$2b$10$...abcdefg
--------------------------------------
```

### 2단계: JWT 세션 시크릿 생성

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### 3단계: 환경변수 설정

`.env.local` 파일에 다음을 추가합니다:

```env
# 관리자 설정
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$...  # 1단계에서 생성한 값
ADMIN_SESSION_SECRET=...        # 2단계에서 생성한 값

# Notion 설정 (기존)
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=...
```

### 4단계: 개발 서버 실행

```bash
npm run dev
```

---

## 로그인

### 관리자 패널 접근

```
http://localhost:3000/admin/login
```

### 로그인 방법

1. **사용자명** 입력: `admin` (또는 설정한 ADMIN_USERNAME)
2. **비밀번호** 입력: 비밀번호 생성 시 사용한 평문 비밀번호
3. **로그인** 버튼 클릭

### 세션 관리

- **세션 유지 시간**: 24시간 (설정 가능)
- **세션 저장 위치**: HttpOnly + Secure 쿠키
- **로그아웃**: 대시보드의 로그아웃 버튼 클릭

---

## 보안 주의사항

### ✅ 필수 보안 조치

1. **강력한 비밀번호 사용**
   - 최소 12자 이상
   - 대문자, 소문자, 숫자, 특수문자 포함
   - 프로덕션 환경에서는 매우 복잡한 비밀번호 사용

2. **.env.local 보호**
   - `.gitignore`에 이미 포함됨 (확인 필수)
   - 절대 GitHub에 커밋하지 말 것
   - 프로덕션 서버에만 환경변수 설정

3. **HTTPS 사용 (프로덕션)**
   - Vercel, Netlify 등 HTTPS 지원 호스팅 필수
   - Secure 쿠키는 HTTPS에서만 동작

4. **환경변수 관리**
   - 로컬: `.env.local` (git 무시)
   - 프로덕션: 호스팅 플랫폼의 환경변수 설정

### 🔐 보안 기능

- **로그인 시도 제한**: 5회 실패 시 5분간 차단
- **JWT 토큰 검증**: Edge Runtime 호환 jose 사용
- **XSS 방지**: React의 기본 이스케이프 메커니즘
- **CSRF 방지**: SameSite=Lax 쿠키 정책
- **보안 헤더**: CSP, X-Frame-Options, HSTS 등

---

## 문제 해결

### Q: 로그인 페이지로 계속 리다이렉트됨

**A:** Middleware 문제일 수 있습니다.

```bash
# 브라우저 개발자 도구 > 애플리케이션 > 쿠키 확인
# admin_session 쿠키가 있는지 확인

# 없으면: 로그인 시도 > 성공 여부 확인
# 개발자 도구 > 네트워크 > POST /api/auth/login 응답 확인
```

### Q: "로그인 시도 초과" 메시지

**A:** 5회 이상 실패했습니다.

- 5분 대기 후 다시 시도
- 올바른 비밀번호 확인 (비밀번호 생성 시 사용한 것)
- 개발 서버 재시작 시 초과화 카운터 리셋됨

### Q: ADMIN_PASSWORD_HASH 값이 잘못됨

**A:** 스크립트 다시 실행하세요.

```bash
# 새 비밀번호로 해시 생성
npx tsx scripts/generate-hash.ts "new_password"

# 출력된 값을 .env.local에 복사
```

### Q: 프로덕션에서 로그인 불가

**A:** 다음을 확인하세요:

1. **환경변수 설정 확인**

   ```bash
   # Vercel 대시보드 > 프로젝트 > Settings > Environment Variables
   ```

2. **HTTPS 확인**
   - Secure 쿠키는 HTTPS에서만 동작
   - http://로 접근하면 쿠키 설정 안 됨

3. **로그 확인**
   - Vercel > Functions > /api/auth/login 로그 확인

---

## 다음 단계

- 포스트 관리 기능 추가 (향후)
- 분석 대시보드 구현 (향후)
- 2FA(이중 인증) 추가 (선택사항)

---

## 참고 문서

- [ROADMAP.md](../ROADMAP.md) - Phase 2 관리자 인증 시스템
- [PRD.md](../PRD.md) - 프로젝트 요구사항
- [next.config.ts](../../next.config.ts) - 보안 헤더 설정
