"use client";
import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import {
  getTutorReviews,
  type TutorReview,
} from "@/services/tutor";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<TutorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getTutorReviews(page, 5);
        if (res.success && res.data?.data) {
          setReviews(res.data.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page]);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="font-bold flex items-center gap-2">
          <MessageSquare className="h-4 w-4" /> Student Reviews
        </h2>
      </div>

      <div className="divide-y divide-border">
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No reviews yet</div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="px-6 py-4 hover:bg-muted/40 transition">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{r.studentName}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < r.rating ? "text-amber-400" : "text-muted"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{r.createdAt}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {r.comment}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/20">
        <p className="text-xs text-muted-foreground">Page {page}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg border border-border text-xs font-semibold disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded-lg border border-border text-xs font-semibold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
