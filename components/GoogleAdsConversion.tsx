"use client";

import Script from "next/script";
import { useEffect } from "react";

const CONVERSION_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
const CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function shouldTrack(): boolean {
  if (!CONVERSION_ID || !CONVERSION_LABEL) return false;
  if (typeof window === "undefined") return false;
  const hash = window.location.hash.toLowerCase();
  return hash.includes("download") || hash.includes("success");
}

function fireConversion(): void {
  if (!CONVERSION_ID || !CONVERSION_LABEL) return;

  const send = (): boolean => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: `${CONVERSION_ID}/${CONVERSION_LABEL}`,
        value: 1.0,
        currency: "INR",
      });
      return true;
    }
    return false;
  };

  if (!send()) {
    const tries = setInterval(() => {
      if (send()) clearInterval(tries);
    }, 300);
    setTimeout(() => clearInterval(tries), 10000);
  }
}

function HashTracker() {
  useEffect(() => {
    const handler = () => {
      if (shouldTrack()) fireConversion();
    };
    handler();
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return null;
}

export default function GoogleAdsConversion() {
  if (!CONVERSION_ID || !CONVERSION_LABEL) return null;

  return (
    <>
      <Script
        id="google-ads-gtag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${CONVERSION_ID}`}
      />
      <Script
        id="google-ads-gtag-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${CONVERSION_ID}');
          `,
        }}
      />
      <HashTracker />
    </>
  );
}
