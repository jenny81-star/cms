# 개인 개발 블로그 CMS 개발 로드맵

Notion 기반 개인 개발 블로그 CMS의 단계별 개발 계획 및 진행 상황 추적 문서

## 개요

개인 개발 블로그 CMS는 개발자를 위한 Notion 기반 블로그 플랫폼으로 다음 기능을 제공합니다:

- **Notion CMS 통합**: Notion 데이터베이스에서 블로그 포스트를 자동 동기화
- **관리자 인증 시스템**: 환경변수 기반 관리자 로그인 및 보호된 라우트
- **관리자 대시보드**: 블로그 운영 현황 모니터링 및 콘텐츠 관리 진입점
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **ISR 캐싱**: 1시간 주기 자동 갱신 및 수동 재검증

## 기술 스택

```
Frontend:
- Next.js 15.5.3 (App Router + Turbopack)
- React 19.1.0 + TypeScript 5
- TailwindCSS v4 + shadcn/ui (new-york style)
- Lucide Icons

Backend/API:
- Next.js API Routes + Server Actions
- Notion API (@notionhq/client)
- Next.js Caching (unstable_cache) + ISR
- Next.js Middleware (인증)

Development:
- ESLint + Prettier + Husky + lint-staged
- Playwright (E2E 테스트)
```

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함
   - 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조
   - 초기 상태의 샘플로 `000-sample.md` 참조

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 완료 표시로 갱신

---

## 개발 단계

### Phase 1: MVP 블로그 기능 구현 -- 완료

- **Task 001: Notion API 통합 및 데이터 모델 구축** -- 완료
  - Notion API 클라이언트 설정 및 인증
  - TypeScript 인터페이스 정의 (Post, Category, NotionBlock)
  - unstable_cache 기반 캐싱 전략 (3600초 재검증)
  - API 라우트 구현 (`/api/posts`, `/api/categories`, `/api/revalidate`)

- **Task 002: 블로그 페이지 UI 구현** -- 완료
  - 홈 페이지 (포스트 리스트, 검색, 카테고리 필터, 페이지네이션)
  - 포스트 상세 페이지 (Notion 블록 렌더링, 코드 하이라이팅)
  - 카테고리 페이지 (카테고리별 포스트 필터링)
  - 404 에러 페이지

- **Task 003: 공통 컴포넌트 및 레이아웃** -- 완료
  - shadcn/ui 기반 공통 UI 컴포넌트
  - 헤더/푸터 레이아웃 컴포넌트
  - Dark/Light 테마 지원
  - 반응형 디자인 (모바일, 태블릿, 데스크톱)

- **Task 004: SEO 및 성능 최적화** -- 완료
  - ISR 기반 정적 생성
  - Next.js Image 컴포넌트 최적화
  - 읽기 시간 계산 기능
  - sitemap.ts 생성

---

### Phase 2: 관리자 인증 시스템

#### 보안 설계 원칙

- 환경변수 기반 자격 증명 관리 (데이터베이스 불필요)
- bcrypt 해시를 통한 비밀번호 암호화
- HttpOnly + Secure 쿠키 기반 세션 관리
- CSRF 방지를 위한 SameSite 쿠키 정책
- Next.js Middleware 기반 라우트 보호
- 무차별 대입 공격 방지를 위한 로그인 시도 제한

#### 환경변수 구성

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$...  # bcrypt 해시값
ADMIN_SESSION_SECRET=random-secret-string-min-32-chars
```

---

- **Task 005: 인증 시스템 설계 및 타입 정의** - 우선순위
  - 예상 일정: 1-2일
  - 기술 스택: TypeScript, Zod
  - 구현 사항:
    - 인증 관련 TypeScript 타입/인터페이스 정의 (`src/lib/types/auth.ts`)
      - `AdminCredentials`, `SessionPayload`, `AuthResult` 인터페이스
      - 로그인 폼 Zod 스키마 (`src/lib/schemas/auth.ts`)
    - 인증 흐름 아키텍처 설계
      - 로그인 요청 -> 자격 증명 검증 -> 세션 토큰 생성 -> 쿠키 설정
      - Middleware 라우트 보호 흐름 설계
    - 환경변수 스키마 확장 (`src/lib/env.ts`)
      - `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` 추가
    - 관리자 라우트 구조 설계
      - `/admin/login` - 로그인 페이지
      - `/admin` - 대시보드 (보호된 라우트)
      - `/api/auth/login` - 로그인 API
      - `/api/auth/logout` - 로그아웃 API
      - `/api/auth/session` - 세션 확인 API

- **Task 006: 환경변수 기반 인증 로직 구현**
  - 예상 일정: 2-3일
  - 기술 스택: bcrypt (또는 bcryptjs), jose (JWT), Next.js Server Actions
  - 구현 사항:
    - 비밀번호 해시 유틸리티 구현 (`src/lib/auth/password.ts`)
      - bcrypt 기반 비밀번호 해시 생성 및 검증 함수
      - 초기 비밀번호 해시 생성 스크립트 (`scripts/generate-hash.ts`)
    - JWT 기반 세션 토큰 관리 (`src/lib/auth/session.ts`)
      - jose 라이브러리를 사용한 JWT 토큰 생성/검증
      - 토큰 만료 시간 설정 (기본 24시간)
      - 토큰 갱신 로직
    - 인증 서비스 구현 (`src/lib/auth/auth-service.ts`)
      - `login(username, password)` - 자격 증명 검증 및 세션 생성
      - `logout()` - 세션 파기
      - `verifySession(token)` - 세션 유효성 검증
      - `getCurrentUser()` - 현재 인증된 사용자 정보 반환
    - 로그인 시도 제한 로직
      - 인메모리 또는 쿠키 기반 실패 횟수 추적
      - 5회 연속 실패 시 5분간 로그인 차단
  - 테스트 체크리스트:
    - 올바른 자격 증명으로 로그인 성공 확인
    - 잘못된 비밀번호로 로그인 실패 확인
    - 잘못된 사용자명으로 로그인 실패 확인
    - JWT 토큰 생성 및 검증 확인
    - 만료된 토큰 거부 확인
    - 로그인 시도 제한 동작 확인

- **Task 007: 로그인 페이지 UI/UX 개발**
  - 예상 일정: 1-2일
  - 기술 스택: React Hook Form, Zod, shadcn/ui, Server Actions
  - 구현 사항:
    - 로그인 페이지 구현 (`src/app/admin/login/page.tsx`)
      - 사용자명/비밀번호 입력 폼
      - React Hook Form + Zod 유효성 검사
      - Server Action 기반 폼 제출 처리
      - 로딩 상태 및 에러 메시지 표시
      - 로그인 성공 시 `/admin` 대시보드로 리다이렉트
    - 로그인 페이지 레이아웃 (`src/app/admin/login/layout.tsx`)
      - 중앙 정렬 카드 레이아웃
      - 블로그 로고 및 타이틀 표시
      - Dark/Light 테마 지원
    - 접근성 고려
      - 키보드 네비게이션 지원
      - aria-label 및 적절한 포커스 관리
      - 스크린 리더 호환 에러 메시지
    - 반응형 디자인
      - 모바일: 전체 너비 폼
      - 데스크톱: 중앙 정렬 카드 (max-width: 400px)

- **Task 008: 세션/쿠키 관리 및 API 라우트 구현**
  - 예상 일정: 2-3일
  - 기술 스택: Next.js Route Handlers, cookies API
  - 구현 사항:
    - 로그인 API 라우트 (`src/app/api/auth/login/route.ts`)
      - POST 요청 처리
      - 자격 증명 검증 후 JWT 토큰 생성
      - HttpOnly + Secure + SameSite=Lax 쿠키 설정
      - Content-Type 검증 (JSON만 허용)
      - 응답에 민감한 정보 미포함
    - 로그아웃 API 라우트 (`src/app/api/auth/logout/route.ts`)
      - POST 요청 처리
      - 세션 쿠키 삭제
      - `/admin/login`으로 리다이렉트
    - 세션 확인 API 라우트 (`src/app/api/auth/session/route.ts`)
      - GET 요청 처리
      - 현재 세션 유효성 확인
      - 인증된 사용자 정보 반환 (사용자명만)
    - 쿠키 설정 사양
      - `name`: `admin_session`
      - `httpOnly`: true
      - `secure`: production에서 true
      - `sameSite`: `lax`
      - `path`: `/admin`
      - `maxAge`: 86400 (24시간)
  - 테스트 체크리스트:
    - 로그인 API가 올바른 쿠키를 설정하는지 확인
    - 로그아웃 API가 쿠키를 정상 삭제하는지 확인
    - 세션 API가 유효한 세션을 올바르게 반환하는지 확인
    - 만료된 세션에 대해 401 응답 확인
    - CSRF 공격 시나리오 방어 확인

- **Task 009: Middleware 기반 보호된 라우트 설정**
  - 예상 일정: 1-2일
  - 기술 스택: Next.js Middleware, jose
  - 구현 사항:
    - Next.js Middleware 구현 (`src/middleware.ts`)
      - `/admin/*` 경로에 대한 인증 검사 (Edge Runtime 호환)
      - `/admin/login` 경로는 인증 검사에서 제외
      - 인증되지 않은 요청은 `/admin/login`으로 리다이렉트
      - 이미 인증된 사용자가 `/admin/login` 접근 시 `/admin`으로 리다이렉트
      - API 라우트 (`/api/auth/*`)는 Middleware에서 제외
    - Middleware 매처 설정
      - `config.matcher`: `/admin/:path*` 패턴
    - Edge Runtime에서의 JWT 검증
      - jose 라이브러리 사용 (Edge Runtime 호환)
      - bcrypt는 Edge Runtime에서 사용 불가하므로 Route Handler에서만 사용
    - 에러 처리
      - 토큰 검증 실패 시 쿠키 삭제 후 로그인 페이지로 리다이렉트
      - 네트워크 에러 등 예외 상황 처리
  - 테스트 체크리스트:
    - 인증 없이 `/admin` 접근 시 로그인 페이지로 리다이렉트 확인
    - 유효한 세션으로 `/admin` 접근 시 정상 표시 확인
    - 만료된 세션으로 `/admin` 접근 시 리다이렉트 확인
    - `/admin/login`은 인증 없이 접근 가능한지 확인
    - 인증된 사용자가 `/admin/login` 접근 시 `/admin`으로 리다이렉트 확인

- **Task 010: 관리자 대시보드 레이아웃 및 UI**
  - 예상 일정: 2-3일
  - 기술 스택: shadcn/ui, Server Components, Lucide Icons
  - 구현 사항:
    - 관리자 레이아웃 (`src/app/admin/(dashboard)/layout.tsx`)
      - 사이드바 또는 상단 네비게이션 바
      - 로그아웃 버튼
      - 현재 로그인된 사용자명 표시
      - 반응형 레이아웃 (모바일: 햄버거 메뉴)
    - 관리자 대시보드 메인 페이지 (`src/app/admin/(dashboard)/page.tsx`)
      - 블로그 통계 카드 (총 포스트 수, 카테고리 수, 최근 포스트 등)
      - 최근 발행된 포스트 목록 (5개)
      - 카테고리별 포스트 분포 차트 (선택사항)
      - 빠른 작업 링크 (Notion 데이터베이스 열기, 캐시 재검증 등)
    - 캐시 재검증 기능
      - 대시보드에서 직접 ISR 재검증 트리거 버튼
      - 재검증 결과 피드백 (성공/실패 토스트 메시지)
    - 관리자 라우트 그룹 구성
      - `(dashboard)` 라우트 그룹으로 인증 필요 페이지 그룹화
      - `login` 페이지는 라우트 그룹 외부에 배치

- **Task 011: 보안 테스트 및 강화**
  - 예상 일정: 1-2일
  - 기술 스택: Playwright, Next.js Security Headers
  - 구현 사항:
    - 보안 헤더 설정 (`next.config.ts`)
      - `X-Content-Type-Options: nosniff`
      - `X-Frame-Options: DENY`
      - `X-XSS-Protection: 1; mode=block`
      - `Strict-Transport-Security` (production)
      - `Content-Security-Policy` 기본 설정
    - XSS 방지 검증
      - 로그인 폼 입력값 살균 확인
      - 서버 응답에 사용자 입력이 반영되지 않는지 확인
    - CSRF 방지 검증
      - SameSite 쿠키 정책 동작 확인
      - 외부 도메인에서의 요청 차단 확인
    - 인증 우회 시도 테스트
      - 직접 URL 접근 시도
      - 조작된 쿠키/토큰으로 접근 시도
      - 만료된 토큰으로 접근 시도
    - 환경변수 보안 검증
      - 클라이언트 번들에 서버 전용 환경변수가 노출되지 않는지 확인
      - `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
  - 테스트 체크리스트:
    - Playwright E2E 테스트로 전체 인증 플로우 검증
    - 로그인 -> 대시보드 접근 -> 로그아웃 플로우 테스트
    - 보안 헤더가 올바르게 설정되었는지 확인
    - 무차별 대입 공격 방지 동작 확인
    - 세션 만료 후 자동 로그아웃 동작 확인

- **Task 012: 배포 설정 및 문서화**
  - 예상 일정: 1일
  - 기술 스택: Vercel, Markdown
  - 구현 사항:
    - `.env.example` 업데이트
      - 관리자 인증 관련 환경변수 추가 및 설명
      - 비밀번호 해시 생성 방법 안내
    - 배포 체크리스트 작성
      - Vercel 환경변수 설정 가이드
      - 프로덕션 보안 설정 확인 목록
    - 관리자 인증 사용 가이드 문서
      - 초기 비밀번호 설정 방법
      - 비밀번호 변경 절차
      - 문제 해결 가이드 (로그인 불가 시 대처)
    - PRD 및 ROADMAP 업데이트
      - Phase 2 완료 상태 반영
      - Phase 3 계획 구체화

---

### Phase 3: 콘텐츠 관리 및 고급 기능 (향후 계획)

- **Task 013: 포스트 관리 기능**
  - 대시보드에서 포스트 목록 조회 및 상태 관리
  - Notion 데이터베이스와의 양방향 동기화
  - 포스트 발행/비발행 전환 기능
  - 드래프트 미리보기 기능

- **Task 014: 분석 대시보드**
  - 페이지뷰 추적 시스템 구축
  - 인기 포스트 랭킹
  - 카테고리별 트래픽 분석
  - 검색 키워드 분석

- **Task 015: SEO 고급 최적화**
  - RSS 피드 생성
  - OG 메타 태그 동적 생성
  - canonical URL 설정
  - 구조화된 데이터 (JSON-LD) 적용

- **Task 016: 사용자 참여 기능**
  - Giscus 기반 댓글 시스템
  - 소셜 공유 버튼
  - 이메일 구독 기능
  - 코드 블록 복사 버튼

- **Task 017: 성능 최적화 및 모니터링**
  - Lighthouse 점수 90+ 달성
  - 번들 사이즈 최적화
  - 모니터링 및 에러 추적 시스템
  - CI/CD 파이프라인 고도화

---

## 보안 고려사항

### 암호화 전략

| 항목          | 방법              | 설명                                         |
| ------------- | ----------------- | -------------------------------------------- |
| 비밀번호 저장 | bcrypt 해시       | 솔트 라운드 10, 평문 비밀번호 절대 저장 금지 |
| 세션 토큰     | JWT (jose)        | HS256 알고리즘, 24시간 만료                  |
| 전송 구간     | HTTPS             | 프로덕션 환경에서 TLS 필수                   |
| 쿠키          | HttpOnly + Secure | 클라이언트 JS에서 접근 불가                  |

### CSRF 방지

- `SameSite=Lax` 쿠키 정책으로 크로스 사이트 요청 차단
- 상태 변경 API는 POST 메서드만 허용
- `Content-Type: application/json` 검증

### XSS 방지

- React의 기본 이스케이프 메커니즘 활용
- `dangerouslySetInnerHTML` 사용 금지
- Content-Security-Policy 헤더 설정
- 로그인 폼 입력값에 대한 Zod 스키마 검증

### 환경변수 보안

- `ADMIN_PASSWORD_HASH`: 해시값만 저장 (평문 비밀번호 금지)
- `ADMIN_SESSION_SECRET`: 최소 32자 랜덤 문자열
- 서버 전용 환경변수에 `NEXT_PUBLIC_` 접두사 사용 금지
- `.env.local`은 `.gitignore`에 반드시 포함

---

## 성능 목표

| 지표                          | 목표    | Phase 1 상태 |
| ----------------------------- | ------- | ------------ |
| 블로그 홈 로드 시간           | < 2초   | 달성         |
| 포스트 페이지 로드 시간       | < 1.5초 | 달성         |
| First Contentful Paint (FCP)  | < 1초   | 측정 필요    |
| Cumulative Layout Shift (CLS) | < 0.1   | 측정 필요    |
| Mobile Lighthouse Score       | > 90    | 측정 필요    |
| 관리자 로그인 응답 시간       | < 500ms | Phase 2      |

---

## 참고 문서

- **PRD**: `docs/PRD.md`
- **이전 로드맵**: `docs/roadmaps/ROADMAP_v1.md`
- **프로젝트 구조**: `docs/guides/project-structure.md`
- **스타일링 가이드**: `docs/guides/styling-guide.md`
- **컴포넌트 패턴**: `docs/guides/component-patterns.md`
- **Next.js 15 가이드**: `docs/guides/nextjs-15.md`
- **폼 처리 가이드**: `docs/guides/forms-react-hook-form.md`

---

**Last Updated:** 2026-03-17
**Current Phase:** Phase 2 - 관리자 인증 시스템
