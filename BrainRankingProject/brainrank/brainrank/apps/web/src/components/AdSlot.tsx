/**
 * 광고 자리 컴포넌트.
 * 지금은 비어 있으며, 추후 Google AdSense 스크립트를 이 안에서만 붙이면 된다.
 */
export function AdSlot({ position }: { position: "header" | "sidebar" | "result-bottom" | "footer" }) {
  // TODO: AdSense 승인 후 <ins className="adsbygoogle" ... /> 삽입
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        data-ad-position={position}
        className="flex h-24 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400"
      >
        AD ({position})
      </div>
    );
  }
  return <div data-ad-position={position} />;
}
