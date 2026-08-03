# BrainRank

종합 테스트 & 랭킹 웹사이트 (Next.js 통합 풀스택 + Prisma)

Express 백엔드를 제거하고 모든 API를 Next.js Route Handler(`apps/web/src/app/api/*`)로 통합했습니다.
서버 하나만 실행하면 되고, Vercel에 그대로 배포할 수 있습니다.

## 실행 방법

```bash
npm install
cp apps/web/.env.example apps/web/.env   # Windows: copy apps\web\.env.example apps\web\.env

cd apps/web
npx prisma migrate dev --name init
npx prisma db seed
cd ../..

npm run dev   # http://localhost:3000 (API 포함)
```

## 관리자 계정 만들기
가입 후 Prisma Studio(`npx prisma studio`)에서 해당 유저의 role을 ADMIN으로 변경하세요.

## 배포 (Vercel)
- Root Directory: `apps/web`
- Build Command: `npx prisma generate && next build`
- 환경변수: `DATABASE_URL`(Neon 등 PostgreSQL), `JWT_SECRET`
- PostgreSQL 사용 시 `prisma/schema.prisma`의 provider를 `postgresql`로 변경 후 마이그레이션 재생성

## 새 테스트 추가 방법
1. `apps/web/src/features/tests/plugins/`에 컴포넌트 1개 추가 (onFinish(score) 호출)
2. `apps/web/src/features/tests/registry.ts`에 1줄 등록
3. `apps/web/prisma/seed.cjs`에 메타 1행 추가 후 `npx prisma db seed`

## 새 업적 추가 방법
1. `apps/web/src/server/achievements.ts`에 조건 1개 추가
2. `apps/web/prisma/seed.cjs`에 메타 1행 추가 후 `npx prisma db seed`
