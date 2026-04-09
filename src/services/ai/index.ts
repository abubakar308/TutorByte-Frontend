export interface SuggestionSubject {
  id: string;
  name: string;
}

export interface SuggestionLanguage {
  id: string;
  name: string;
}

export interface SuggestionTutor {
  id: string;
  bio: string | null;
  user: {
    name: string | null;
  };
}

export interface SearchSuggestionsResponse {
  subjects: SuggestionSubject[];
  languages: SuggestionLanguage[];
  tutors: SuggestionTutor[];
}

export const getSearchSuggestions = async (query: string): Promise<{
  success: boolean;
  data: SearchSuggestionsResponse;
  message?: string;
}> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ai/suggestions?query=${encodeURIComponent(
        query
      )}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    return {
      success: data.success,
      data: data.data || { subjects: [], languages: [], tutors: [] },
      message: data.message,
    };
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return {
      success: false,
      data: { subjects: [], languages: [], tutors: [] },
      message: "Failed to fetch suggestions",
    };
  }
};

export const getRecommendedTutors = async (): Promise<{
  success: boolean;
  data: SuggestionTutor[];
  message?: string;
}> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ai/recommendations`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }
    );

    const data = await res.json();

    return {
      success: data.success,
      data: data.data || [],
      message: data.message,
    };
  } catch (error) {
    console.error("Error fetching recommended tutors:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch recommendations",
    };
  }
};