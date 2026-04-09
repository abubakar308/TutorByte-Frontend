"use client";

import { useEffect, useState } from "react";
import { ChevronDown, CircleHelp, Loader2 } from "lucide-react";
import Link from "next/link";

export default function FaqSection() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const res = await getFaqs();
        if (res.success) {
          const items = Array.isArray(res.data) ? res.data : [];
          setFaqs(items);
          if (items.length > 0) setOpenId(items[0].id);
        } else {
          setFaqs([]);
        }
      } catch (error) {
        console.error("Failed to fetch FAQs", error);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <h2 className="mb-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-primary/80">
          <span className="h-px w-8 bg-primary/30"></span>
          Frequently Asked Questions
          <span className="h-px w-8 bg-primary/30"></span>
        </h2>

        <h3 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Answers to the questions students ask most.
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Explore common questions about tutor discovery, booking, support, and the TutorByte learning experience.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse rounded-2xl border border-border bg-card p-5"
            >
              <div className="h-5 w-2/3 rounded bg-muted" />
              <div className="mt-4 h-4 w-full rounded bg-muted" />
              <div className="mt-2 h-4 w-5/6 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : faqs.length > 0 ? (
        <div className="mx-auto max-w-4xl space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <article
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-muted/40"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <CircleHelp className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold tracking-tight text-foreground">
                        {faq.question}
                      </h4>
                      {faq.category && (
                        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary">
                          {faq.category}
                        </p>
                      )}
                    </div>
                  </div>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-border px-5 pb-5 pt-4">
                    <p className="pl-12 text-sm leading-7 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <CircleHelp className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
          <p className="font-semibold text-foreground">No FAQs available right now.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please check again later.
          </p>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          href="/faq"
          className="inline-flex items-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
        >
          View All FAQs
        </Link>
      </div>
    </section>
  );
}