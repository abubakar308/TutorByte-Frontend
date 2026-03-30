# TutorByte Dashboard API Integration Guide

## Overview
All three dashboard modules (Admin, Student, Tutor) have been updated to fetch real data from the backend API instead of using mock data.

## API Services

### Location
`src/services/api/dashboard.ts`

### Key Features
- ✅ Server-side data fetching with authentication headers
- ✅ Token management via cookies
- ✅ Type-safe API responses
- ✅ Error handling and logging
- ✅ Loading states and fallbacks

## API Endpoints Used

### Admin Dashboard
- `GET /api/v1/admin/dashboard-stats` - Platform statistics
- `GET /api/v1/admin/users` - List users with pagination
- `GET /api/v1/admin/logs` - Admin activity logs

### Tutor Dashboard
- `GET /api/v1/tutors/dashboard/stats` - Tutor earnings and stats
- `GET /api/v1/tutors/bookings` - List tutor bookings
- `GET /api/v1/tutors/reviews` - Student reviews
- `GET /api/v1/tutors/profile/me` - Tutor profile info

### Student Dashboard
- `GET /api/v1/students/dashboard/stats` - Student learning stats
- `GET /api/v1/students/bookings` - Student bookings
- `GET /api/v1/students/recommended-tutors` - Recommended tutors

## Component Updates

### Admin Dashboard
**File:** `src/app/(DashboardLayout)/@admin/dashboard/page.tsx`
- Fetches dashboard stats, users, and logs
- Real-time data with loading states
- User search functionality
- Pending tutors display with approve/reject options

**State Variables:**
```typescript
const [stats, setStats] = useState<AdminDashboardStats | null>(null);
const [users, setUsers] = useState<AdminUser[]>([]);
const [loading, setLoading] = useState(true);
```

### Student Dashboard
**File:** `src/app/(DashboardLayout)/@student/dashboard/page.tsx`
- Displays student learning progress
- Shows all student bookings with filters
- Lists recommended tutors
- Next session preview

**State Variables:**
```typescript
const [stats, setStats] = useState<StudentStats | null>(null);
const [bookings, setBookings] = useState<StudentBooking[]>([]);
const [recommended, setRecommended] = useState<RecommendedTutor[]>([]);
```

### Tutor Dashboard
**File:** `src/app/(DashboardLayout)/@tutor/dashboard/page.tsx`
- Shows tutor earnings and performance
- Booking request management
- Student reviews and ratings
- Tutor profile information

**State Variables:**
```typescript
const [stats, setStats] = useState<TutorStats | null>(null);
const [bookings, setBookings] = useState<TutorBooking[]>([]);
const [reviews, setReviews] = useState<TutorReview[]>([]);
const [profile, setProfile] = useState<any>(null);
```

## Data Fetching Pattern

### 1. Server Function (in dashboard.ts)
```typescript
export const getAdminDashboardStats = async (): Promise<
  ApiResponse<AdminDashboardStats>
> => {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${API_URL}/admin/dashboard-stats`, {
      headers,
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch admin dashboard stats:", error);
    return {
      success: false,
      message: "Failed to fetch dashboard stats",
    };
  }
};
```

### 2. Component Implementation
```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const statsRes = await getAdminDashboardStats();
      
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

## Environment Variables

Make sure your `.env.local` has:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## Authentication

The API service automatically:
1. Gets the authentication token from cookies
2. Adds Authorization header: `Bearer {token}`
3. Handles token expiration gracefully
4. Returns null or error if unauthenticated

## Types Defined

### Admin Types
```typescript
interface AdminDashboardStats {
  totalRevenue: number;
  totalUsers: number;
  activeSessions: number;
  pendingApprovals: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  status: "ACTIVE" | "BLOCKED";
  // ... more fields
}
```

### Tutor Types
```typescript
interface TutorStats {
  totalEarnings: number;
  totalSessions: number;
  averageRating: number;
  activeStudents: number;
}

interface TutorBooking {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  totalPrice: number;
}

interface TutorReview {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
```

### Student Types
```typescript
interface StudentStats {
  totalSessions: number;
  hoursLearned: number;
  totalSpent: number;
  averageRating: number;
}

interface StudentBooking {
  id: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  totalPrice: number;
}

interface RecommendedTutor {
  id: string;
  name: string;
  subject: string;
  averageRating: number;
  hourlyRate: number;
}
```

## Common Issues & Solutions

### 1. **Token Not Found**
**Problem:** "Invalid token format" error
**Solution:** 
- Ensure user is logged in
- Check that token is stored in cookies
- Verify token format in auth service

### 2. **CORS Errors**
**Problem:** Cross-Origin Request Blocked
**Solution:**
- Ensure backend has CORS enabled for your frontend URL
- Check `NEXT_PUBLIC_API_URL` points to correct backend

### 3. **No Data Displayed**
**Problem:** Components show "Loading..." indefinitely
**Solution:**
- Check network tab in DevTools
- Verify API endpoint is correct
- Check if user has appropriate permissions
- Review console for error messages

### 4. **Stale Data**
**Problem:** Dashboards don't update
**Solution:**
- All queries use `cache: "no-store"`
- Manually refresh page or call `fetchData()` again
- Implement refetch interval if needed

## Next Steps

1. **Add more endpoints** as needed for additional functionality
2. **Implement real-time updates** using WebSockets or polling
3. **Add search/filter** functionality to listings
4. **Implement pagination** for large datasets
5. **Add error boundaries** for better error handling
6. **Create hooks** to abstract data fetching logic

## Testing

To test the integration:

1. Ensure your backend API is running on `http://localhost:5000`
2. Log in with your credentials
3. Navigate to respective dashboard
4. Check DevTools Network tab for API calls
5. Verify data displays correctly

## Features Implemented

- ✅ Admin Dashboard
  - Real-time stats
  - User management
  - Pending approvals
  - Activity logs

- ✅ Student Dashboard
  - Learning progress tracking
  - Booking history with filters
  - Recommended tutors
  - Next session preview

- ✅ Tutor Dashboard
  - Earnings overview
  - Booking management
  - Student reviews
  - Profile information

All dashboards are now fully dynamic and connected to your backend API!
