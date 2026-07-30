import pkg from "@prisma/client";
const { PrismaClient } = pkg;

// Next.js dev 핫 리로드 시 PrismaClient 중복 생성 방지
const globalForPrisma = globalThis as unknown as { prisma?: InstanceType<typeof PrismaClient> };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
