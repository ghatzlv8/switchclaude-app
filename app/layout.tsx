import type { Metadata } from "next";

const SITE = "https://switchclaude.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "SwitchClaude — Switch Claude accounts in 2 seconds",
    template: "%s — SwitchClaude",
  },
  description:
    "The menubar switcher for Claude Desktop. Swap between multiple Claude accounts (email or Google login) in 2 seconds. Isolated profiles — chats never lost. macOS, Windows, Linux. $9.99 one-time per extra account.",
  keywords: [
    "Claude Desktop", "Claude account switcher", "switch Claude accounts",
    "multiple Claude accounts", "Claude profiles", "Anthropic Claude",
    "Claude Google login", "Claude menubar app",
  ],
  authors: [{ name: "SwitchClaude", url: SITE }],
  creator: "SwitchClaude",
  alternates: { canonical: SITE },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "SwitchClaude",
    title: "SwitchClaude — Switch Claude accounts in 2 seconds",
    description:
      "One click in your menubar, 2 seconds, other Claude account. Isolated profiles, chats never lost. $9.99 one-time.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "SwitchClaude — switch Claude accounts in 2 seconds" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwitchClaude — Switch Claude accounts in 2 seconds",
    description: "Menubar switcher for Claude Desktop. $9.99 one-time. macOS, Windows, Linux.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-zinc-900 antialiased">{children}</body>
    </html>
  );
}
