# BrainRank

종합 테스트 & 랭킹 웹사이트 (Next.js + Express + Prisma/SQLite)

## 실행 방법

```bash
# 1. 의존성 설치 (루트에서)
npm install

# 2. API 환경변수 준비
cp apps/api/.env.example apps/api/.env

# 3. DB 마이그레이션 + 시드
cd apps/api
npx prisma migrate dev --name init
npx prisma db seed
cd ../..

# 4. 서버 실행 (터미널 2개)
npm run dev:api   # http://localhost:4000
npm run dev:web   # http://localhost:3000
```

## 관리자 계정 만들기
가입 후 Prisma Studio(`npx prisma studio`)에서 해당 유저의 role을 ADMIN으로 변경하세요.

## 새 테스트 추가 방법
1. `apps/web/src/features/tests/plugins/`에 컴포넌트 1개 추가 (onFinish(score) 호출)
2. `apps/web/src/features/tests/registry.ts`에 1줄 등록
3. `apps/api/prisma/seed.ts`에 메타 1행 추가 후 `npx prisma db seed`

## 새 업적 추가 방법
1. `apps/api/src/features/achievements/achievement.rules.ts`에 조건 1개 추가
2. `apps/api/prisma/seed.ts`에 메타 1행 추가 후 `npx prisma db seed`
