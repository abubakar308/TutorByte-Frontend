export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: string;
};

export const mockFaqs: FaqItem[] = [
  {
    id: "1",
    question: "How do I find the right tutor on TutorByte?",
    answer:
      "You can browse tutors by subject, language, hourly rate, and search keyword. Tutor profiles include teaching areas, pricing, and other helpful details to help you choose the right match.",
    category: "Tutors",
  },
  {
    id: "2",
    question: "Can I view tutor details before booking?",
    answer:
      "Yes. Tutor detail pages are public, so students can review tutor information, subjects, languages, pricing, and profile details before making a booking decision.",
    category: "Booking",
  },
  {
    id: "3",
    question: "Is the tutors page publicly accessible?",
    answer:
      "Yes. The tutors listing page and tutor details page are public so visitors can explore available tutors without signing in first.",
    category: "Access",
  },
  {
    id: "4",
    question: "How are tutor hourly rates shown?",
    answer:
      "Each tutor card and profile shows the hourly rate clearly so students can compare tutors easily and apply a maximum hourly rate filter from the tutors listing page.",
    category: "Pricing",
  },
  {
    id: "5",
    question: "What can I search for in the tutors page?",
    answer:
      "You can search by tutor name, subject, or language. Smart suggestions help you quickly choose matching tutors, subjects, and languages while typing.",
    category: "Search",
  },
  {
    id: "6",
    question: "How many tutors are shown per page?",
    answer:
      "The tutors listing uses pagination and shows 12 tutors per page for a clean and consistent browsing experience.",
    category: "Pagination",
  },
];