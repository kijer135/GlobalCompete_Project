import Link from "next/link";
import { testRegistry } from "@/features/tests/registry";

export default function TestListPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">테스트</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.values(testRegistry).map((t) => (
          <Link key={t.id} href={`/tests/${t.id}`}
            className="rounded-xl border p-6 transition hover:shadow-md">
            <h2 className="text-xl font-semibold">{t.name}</h2>
            <p className="mt-2 text-sm text-gray-500">{t.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
