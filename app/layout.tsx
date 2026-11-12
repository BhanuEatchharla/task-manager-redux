
import { Suspense } from "react";

import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "TaskFlow Redux",
  description: "Task Management with Redux Toolkit",
};

function LoadingFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <p className="text-lg font-medium text-slate-600">
        Loading TaskFlow...
      </p>
    </main>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<LoadingFallback />}>
          <Providers>
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
