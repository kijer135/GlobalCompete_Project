import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { testRegistry } from "@/features/tests/registry";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl space-y-10 p-6">
      <section className="py-16 text-center">
        <h1 className="text-5xl font-bold">BrainRank</h1>
        <p className="mt-4 text-lg text-gray-500">
          당신의 반응속도, 클릭 속도, 기억력을 테스트하고 랭킹에 도전하세요.
        </p>
        <Link href="/tests"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700">
          테스트 시작하기
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">인기 테스트</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(testRegistry).map((t) => (
            <Link key={t.id} href={`/tests/${t.id}`}
              className="rounded-xl border p-6 transition hover:shadow-md">
              <h3 className="text-xl font-semibold">{t.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{t.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot position="footer" />
    </main>
  );
}
