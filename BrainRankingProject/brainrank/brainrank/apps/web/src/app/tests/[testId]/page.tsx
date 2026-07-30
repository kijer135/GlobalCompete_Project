import { notFound } from "next/navigation";
import { testRegistry } from "@/features/tests/registry";
import { TestShell } from "@/features/tests/TestShell";

export default async function TestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const meta = testRegistry[testId];
  if (!meta) notFound();
  return <TestShell meta={meta} />;
}
