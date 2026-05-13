"use client";

import { useEffect, useRef, useState } from "react";
import "../admin-styles.css";

export default function AdminPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const injectedScripts: HTMLScriptElement[] = [];

    async function mountLegacyAdmin() {
      const response = await fetch("/Admin/index.html");
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const body = doc.body;
      const head = doc.head;
      const scripts = Array.from(doc.querySelectorAll("script"));
      const headStyles = Array.from(
        head.querySelectorAll("style, link[rel='stylesheet'], link[rel='preload'], link[rel='prefetch'], link[rel='preconnect']")
      );
      scripts.forEach((script) => script.remove());

      if (containerRef.current) {
        containerRef.current.innerHTML = body.innerHTML;
      }

      headStyles.forEach((node) => {
        const clone = node.cloneNode(true) as HTMLElement;
        document.head.appendChild(clone);
      });

      if (doc.title) {
        document.title = doc.title;
      }

      for (const script of scripts) {
        const injected = document.createElement("script");
        if (script.src) {
          injected.src = script.src;
          injected.async = false;
        }
        if (script.type) injected.type = script.type;
        if (script.textContent) injected.textContent = script.textContent;
        document.body.appendChild(injected);
        injectedScripts.push(injected);
        if (script.src) {
          await new Promise<void>((resolve) => {
            injected.addEventListener("load", () => resolve());
            injected.addEventListener("error", () => resolve());
          });
        }
      }

      if (typeof window !== "undefined") {
        const fireEvent = (target: EventTarget, type: string) => {
          const event = new Event(type, { bubbles: true, cancelable: false });
          target.dispatchEvent(event);
        };

        fireEvent(document, "DOMContentLoaded");
        fireEvent(window, "load");

        if (typeof (window as any)._initCustomSelects === "function") {
          (window as any)._initCustomSelects(document);
        }
      }

      if (!cancelled) setLoaded(true);
    }

    mountLegacyAdmin();
    return () => {
      cancelled = true;
      injectedScripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#fff8f5] text-[#3d1c0e]">
      <div ref={containerRef} className="min-h-screen" />
      {!loaded ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 text-sm font-semibold text-slate-700">
          Loading admin panel...
        </div>
      ) : null}
    </main>
  );
}
