import { mockFaqs } from "@/mockData/faq";
import { CircleHelp } from "lucide-react";

export default async function FaqPage() {
  // API remove → direct mock data
  const faqs = mockFaqs;

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="border-b border-border/60 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <CircleHelp className="h-3.5 w-3.5" />
            FAQ
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
            Frequently Asked Questions
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Find answers to common questions about TutorByte, tutor booking,
            support, and platform usage.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {faqs.length > 0 ? (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <article
                key={faq.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
              >
                {/* Category */}
                {faq.category && (
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                    {faq.category}
                  </p>
                )}

                {/* Question */}
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  {faq.question}
                </h2>

                {/* Answer */}
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <CircleHelp className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
            <p className="font-semibold text-foreground">
              No FAQs available right now.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please check again later.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}