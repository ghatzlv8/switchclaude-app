"use client";

import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const GSC = process.env.NEXT_PUBLIC_GSC_TOKEN || "";

function consented(): boolean {
  try {
    const v = localStorage.getItem("sc-consent");
    return !!v && !!JSON.parse(v).ga;
  } catch {
    return false;
  }
}

function loadGA() {
  if (!GA_ID || (window as unknown as { _scGa?: boolean })._scGa) return;
  (window as unknown as { _scGa?: boolean })._scGa = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  const inline = document.createElement("script");
  inline.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`;
  document.head.appendChild(inline);
}

export default function SiteTags() {
  useEffect(() => {
    if (consented()) loadGA();
    const on = () => {
      if (consented()) loadGA();
    };
    window.addEventListener("sc-consent", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("sc-consent", on);
      window.removeEventListener("storage", on);
    };
  }, []);
  if (!GSC) return null;
  return <meta name="google-site-verification" content={GSC} />;
}
