"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Star, Users2 } from "lucide-react";
import TutorCard from "@/components/ui/tutors/TutorCard";
import { getAllTutors, Tutor } from "@/services/tutors";

type TabKey = "top" | "popular" | "new";

export default function FeaturedTutorsSection() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("top");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const tutorsRes = await getAllTutors();

        const tutorsData = tutorsRes?.data?.tutors;

        if (tutorsRes?.success && Array.isArray(tutorsData)) {
          const approvedTutors = tutorsData.filter((t: Tutor) => {
            return (
              t?.isApproved &&
              t?.user?.name &&
              t?.bio &&
              Array.isArray(t?.subjects) &&
              t.subjects.length > 0 &&
              Array.isArray(t?.languages) &&
              t.languages.length > 0
            );
          });

          setTutors(approvedTutors);
        } else {
          setError(tutorsRes?.message || "Unable to load tutors right now.");
        }
      } catch (err) {
        console.error("Error loading tutors:", err);
        setError("Something went wrong while loading featured tutors.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const visibleTutors = useMemo(() => {
    const approvedTutors = [...tutors];

    if (activeTab === "top") {
      return approvedTutors
        .filter(
          (tutor) =>
            Number(tutor?.averageRating || 0) >= 4 &&
            Number(tutor?.totalReviews || 0) >= 1
        )
        .sort((a, b) => {
          const ratingDiff =
            Number(b?.averageRating || 0) - Number(a?.averageRating || 0);

          if (ratingDiff !== 0) return ratingDiff;

          return Number(b?.totalReviews || 0) - Number(a?.totalReviews || 0);
        })
        .slice(0, 8);
    }

    if (activeTab === "popular") {
      return approvedTutors
        .filter(
          (tutor) =>
            Number(tutor?._count?.bookings || 0) > 0 ||
            Number(tutor?.totalReviews || 0) > 0
        )
        .sort((a, b) => {
          const bookingDiff =
            Number(b?._count?.bookings || 0) - Number(a?._count?.bookings || 0);

          if (bookingDiff !== 0) return bookingDiff;

          const reviewDiff =
            Number(b?.totalReviews || 0) - Number(a?.totalReviews || 0);

          if (reviewDiff !== 0) return reviewDiff;

          return Number(b?.averageRating || 0) - Number(a?.averageRating || 0);
        })
        .slice(0, 8);
    }

    return approvedTutors
      .sort(
        (a, b) =>
          new Date(b?.createdAt || "").getTime() -
          new Date(a?.createdAt || "").getTime()
      )
      .slice(0, 8);
  }, [tutors, activeTab]);

  const emptyStateContent = useMemo(() => {
    if (activeTab === "top") {
      return {
        title: "No top-rated tutors available right now",
        description:
          "We could not find tutors with strong ratings yet. Explore all tutors to find the right educator for you.",
      };
    }

    if (activeTab === "popular") {
      return {
        title: "No popular tutors found yet",
        description:
          "There are no tutors with enough activity yet. Browse all tutors and discover new learning opportunities.",
      };
    }

    return {
      title: "No newly added tutors available right now",
      description:
        "We could not find any recently approved tutors at the moment. Please check again later.",
    };
  }, [activeTab]);

  return (
    <section id="tutors" className="relative overflow-hidden bg-muted/30 py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Star className="h-3.5 w-3.5 fill-primary" />
              Top Educators
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Learn from our <span className="text-primary">top-rated tutors</span>.
            </h2>

            <p className="mt-3 text-base text-muted-foreground">
              Carefully reviewed educator profiles with strong ratings and proven
              results.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {[
              { key: "top", label: "Top Rated" },
              { key: "popular", label: "Popular" },
              { key: "new", label: "New Tutors" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow"
                    : "border border-border bg-card text-foreground hover:border-primary/30 hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}

            <Link
              href="/tutors"
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
            >
              Explore All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[390px] animate-pulse rounded-2xl border border-border/60 bg-card"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center">
            <AlertCircle className="mx-auto mb-4 h-10 w-10 text-rose-500" />
            <p className="text-base font-semibold text-foreground">
              We could not load tutors right now
            </p>
            <p className="mx-auto mt-1 max-w-xl text-sm text-muted-foreground">
              {error} Please try again or browse all educators to continue your
              learning journey.
            </p>
            <Link
              href="/tutors"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Browse Tutors
            </Link>
          </div>
        ) : visibleTutors.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {visibleTutors.map((tutor) => (
              <div key={tutor.id} className="h-full">
                <TutorCard tutor={tutor} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center">
            <Users2 className="mx-auto mb-4 h-11 w-11 text-muted-foreground/50" />
            <p className="text-base font-semibold text-foreground">
              {emptyStateContent.title}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {emptyStateContent.description}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/tutors"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Explore Tutors
              </Link>
              <Link
                href="/become-tutor"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
              >
                Become a Tutor
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}