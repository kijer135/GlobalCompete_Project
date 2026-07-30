import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "BrainRank",
  description: "반응속도, 클릭 속도 등 다양한 능력 테스트와 랭킹",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
