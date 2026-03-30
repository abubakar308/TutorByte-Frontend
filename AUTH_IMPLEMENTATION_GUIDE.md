# TutorByte Authentication & Role-Based Access Control System

## ✅ Implementation Overview

This document describes the complete role-based authentication system implemented for TutorByte with support for ADMIN, TUTOR, and STUDENT roles, comprehensive CRUD operations, session management, and token handling.

---

## 📋 System Architecture

### Core Components

1. **Token Management** (`lib/tokenUtils.ts`)
   - Enhanced JWT token handling with role support
   - Token expiration tracking and validation
   - Session duration calculations

2. **Authentication Service** (`services/auth/index.ts`)
   - User login/registration with role-based tokens
   - Access and refresh token management
   - Role validation functions
   - User authentication checking

3. **Auth Middleware** (`lib/authMiddleware.ts`)
   - Role-based access control utilities
   - Permission management system
   - Route protection and validation
   - Ownership verification

4. **Session Manager** (`lib/sessionManager.ts`)
   - Session lifecycle management
   - Token refresh automation
   - Inactivity tracking
   - Multi-tab synchronization

5. **API Services**
   - `services/admin/index.ts` - Admin CRUD operations
   - `services/tutor/index.ts` - Tutor CRUD operations
   - `services/student/index.ts` - Student CRUD operations

---

## 🔐 Token & Session Management

### Token Structure

```typescript
interface TokenPayload {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "STUDENT" | "TUTOR";
  exp: number;      // Expiration timestamp
  iat: number;      // Issued at timestamp
}
```

### Access Tokens
- **Duration**: 24 hours
- **Storage**: HttpOnly cookies for security
- **Refresh**: Automatic when expiring within 5 minutes

### Refresh Tokens
- **Duration**: 7 days (configurable)
- **Usage**: Obtain new access tokens when expired
- **Security**: Stored securely, validated on backend

### Implementation Example

```typescript
import { loginUser } from "@/services/auth";

// Login user
const response = await loginUser({
  email: "user@example.com",
  password: "password123"
});

if (response.success) {
  // Tokens automatically stored in cookies
  // Access tokens with role info are set
}
```

---

## 👥 Role-Based Access Control

### Roles

| Role   | Purpose | Dashboard |
|--------|---------|-----------|
| ADMIN  | System administration, user management | `/admin/dashboard` |
| TUTOR  | Manage sessions, profile, earnings | `/tutor/dashboard` |
| STUDENT| Book sessions, find tutors, pay | `/dashboard` |

### Permissions by Role

**ADMIN Permissions:**
- `manage_users` - Create, update, delete users
- `manage_tutors` - Approve/reject tutor applications
- `manage_payments` - Process refunds, adjust payments
- `manage_bookings` - Modify or cancel bookings
- `view_analytics` - Access dashboard statistics
- `manage_system` - System-wide configurations
- `view_logs` - Access activity logs
- `block_users` - Block/unblock accounts

**TUTOR Permissions:**
- `manage_own_profile` - Update tutor information
- `manage_availability` - Set availability schedule
- `accept_bookings` - Accept/reject student bookings
- `complete_sessions` - Mark sessions as complete
- `receive_payments` - Access earnings and withdrawals
- `view_reviews` - Read student reviews
- `view_earnings` - Check payment history

**STUDENT Permissions:**
- `book_tutors` - Reserve tutor sessions
- `search_tutors` - Find and filter tutors
- `manage_bookings` - Modify or cancel bookings
- `make_payments` - Pay for sessions
- `leave_reviews` - Rate and comment on tutors
- `view_history` - Access session history
- `manage_favorites` - Save favorite tutors
- `manage_profile` - Update profile information

---

## 🔒 Authentication & Validation

### Check User Authentication

```typescript
import { getCurrentUser, requireAuth } from "@/services/auth";

// Get current user (null if not authenticated)
const user = await getCurrentUser();

// Require authentication (throw error if not authenticated)
const authenticatedUser = await requireAuth();
```

### Check User Role

```typescript
import { isUserRole, requireRole } from "@/services/auth";

// Check if user has specific role
const isAdmin = await isUserRole("ADMIN");

// Require specific role (throw error if not)
const admin = await requireRole("ADMIN");
```

### Role-Based Validation

```typescript
import {
  requireAdmin,
  requireTutor,
  requireStudent,
  requireAdminOrTutor,
} from "@/lib/authMiddleware";

// Require specific role
const admin = await requireAdmin();
const tutor = await requireTutor();
const student = await requireStudent();

// Require one of multiple roles
const adminOrTutor = await requireAdminOrTutor();
```

### Permission Checking

```typescript
import {
  hasPermission,
  requirePermission,
} from "@/lib/authMiddleware";

// Check if user has permission
const canManageUsers = await hasPermission("manage_users");

// Require permission (throw error if missing)
const user = await requirePermission("approve_tutors");
```

---

## 👨‍💼 ADMIN CRUD OPERATIONS

### User Management

```typescript
import {
  getAdminUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  changeUserStatus,
} from "@/services/admin";

// Get all users with filters
const users = await getAdminUsers(
  page = 1,
  limit = 10,
  search = "",
  role = "STUDENT",
  status = "ACTIVE"
);

// Get specific user
const user = await getUserById("user-id-123");

// Update user
await updateUser("user-id-123", {
  name: "John Doe",
  email: "john@example.com",
  status: "ACTIVE"
});

// Block/unblock user
await blockUser("user-id-123");
await unblockUser("user-id-123");
```

### Tutor Management

```typescript
import {
  getAdminTutors,
  approveTutor,
  rejectTutor,
  updateTutorStatus,
} from "@/services/admin";

// Get pending tutors
const tutors = await getAdminTutors(
  page = 1,
  limit = 10,
  search = "",
  status = "PENDING"
);

// Approve tutor application
await approveTutor("tutor-id-123");

// Reject tutor application
await rejectTutor("tutor-id-123");

// Update tutor status
await updateTutorStatus("tutor-id-123", "APPROVED");
```

### Payment Management

```typescript
import {
  getAdminPayments,
  refundPayment,
  updatePaymentStatus,
} from "@/services/admin";

// Get payments with filters
const payments = await getAdminPayments(
  page = 1,
  limit = 10,
  status = "PAID",
  startDate = "2026-01-01",
  endDate = "2026-12-31"
);

// Refund payment
await refundPayment("payment-id-123", "Refund reason");

// Update payment status
await updatePaymentStatus("payment-id-123", "REFUNDED");
```

### Booking Management

```typescript
import {
  getAdminBookings,
  updateBooking,
  cancelBooking,
  deleteBooking,
} from "@/services/admin";

// Get all bookings
const bookings = await getAdminBookings(
  page = 1,
  limit = 10,
  status = "PENDING",
  tutorId = "tutor-123",
  studentId = "student-123"
);

// Update booking
await updateBooking("booking-id-123", {
  status: "CONFIRMED"
});

// Cancel booking
await cancelBooking("booking-id-123", "Tutor unavailable");
```

### Analytics & Dashboard

```typescript
import { getAdminDashboardStats } from "@/services/admin";

const stats = await getAdminDashboardStats();

console.log({
  totalRevenue: stats.data?.totalRevenue,
  totalUsers: stats.data?.totalUsers,
  activeSessions: stats.data?.activeSessions,
  pendingApprovals: stats.data?.pendingApprovals,
});
```

---

## 👨‍🏫 TUTOR CRUD OPERATIONS

### Profile Management

```typescript
import {
  getTutorProfile,
  updateTutorProfile,
} from "@/services/tutor";

// Get tutor profile
const profile = await getTutorProfile();
// Or: const profile = await getTutorProfile("tutor-id");

// Update profile
await updateTutorProfile({
  bio: "Experienced math tutor",
  experienceYears: 5,
  hourlyRate: 25,
});
```

### Booking Management

```typescript
import {
  getTutorBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
  cancelBooking,
} from "@/services/tutor";

// Get tutor bookings
const bookings = await getTutorBookings(
  page = 1,
  limit = 10,
  status = "PENDING",
  startDate = "2026-01-01",
  endDate = "2026-12-31"
);

// Accept booking
await acceptBooking("booking-id-123");

// Complete session
await completeBooking("booking-id-123", "Great session!");

// Cancel booking
await cancelBooking("booking-id-123", "Emergency");

// Reject booking
await rejectBooking("booking-id-123", "Already booked");
```

### Availability Management

```typescript
import {
  getTutorAvailabilities,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  bulkUpdateAvailabilities,
} from "@/services/tutor";

// Get availability schedule
const availabilities = await getTutorAvailabilities();

// Create time slot
await createAvailability({
  dayOfWeek: "MONDAY",
  startTime: "09:00",
  endTime: "17:00",
  isActive: true,
});

// Update time slot
await updateAvailability("availability-id-123", {
  startTime: "10:00",
  endTime: "18:00",
});

// Delete time slot
await deleteAvailability("availability-id-123");

// Bulk update availability
await bulkUpdateAvailabilities([
  { dayOfWeek: "MONDAY", startTime: "09:00", endTime: "17:00", isActive: true },
  { dayOfWeek: "TUESDAY", startTime: "09:00", endTime: "17:00", isActive: true },
]);
```

### Reviews & Earnings

```typescript
import {
  getTutorReviews,
  getTutorEarnings,
  requestWithdrawal,
} from "@/services/tutor";

// Get reviews
const reviews = await getTutorReviews(page = 1, limit = 5);

// Get earnings
const earnings = await getTutorEarnings(
  startDate = "2026-01-01",
  endDate = "2026-12-31"
);

// Request withdrawal
await requestWithdrawal(500); // Request $500 withdrawal
```

---

## 👨‍🎓 STUDENT CRUD OPERATIONS

### Profile Management

```typescript
import {
  getStudentProfile,
  updateStudentProfile,
} from "@/services/student";

// Get student profile
const profile = await getStudentProfile();

// Update profile
await updateStudentProfile({
  bio: "High school student interested in math",
  grade: "12",
  preferences: ["Math", "Physics"],
});
```

### Booking Management

```typescript
import {
  getStudentBookings,
  createBooking,
  cancelBooking,
  rescheduleBooking,
} from "@/services/student";

// Get student bookings
const bookings = await getStudentBookings(
  page = 1,
  limit = 10,
  status = "PENDING",
  tutorId = "tutor-id-123"
);

// Create booking
const booking = await createBooking({
  tutorId: "tutor-id-123",
  subject: "Mathematics",
  bookingDate: "2026-02-15",
  startTime: "14:00",
  endTime: "15:00",
  totalPrice: 25,
});

// Cancel booking
await cancelBooking("booking-id-123", "Schedule conflict");

// Reschedule booking
await rescheduleBooking(
  "booking-id-123",
  "2026-02-16",
  "15:00"
);
```

### Find & Book Tutors

```typescript
import {
  searchTutors,
  getRecommendedTutors,
  getTutorDetails,
} from "@/services/student";

// Get recommended tutors
const recommended = await getRecommendedTutors(
  limit = 3,
  subject = "Mathematics"
);

// Search tutors
const results = await searchTutors(
  query = "experienced",
  page = 1,
  limit = 10,
  subject = "Mathematics",
  minRating = 4.0
);

// Get tutor full details
const tutorDetails = await getTutorDetails("tutor-id-123");
```

### Payments & Reviews

```typescript
import {
  initiatePayment,
  verifyPayment,
  createReview,
  addFavoriteTutor,
} from "@/services/student";

// Initiate payment
const payment = await initiatePayment(
  bookingId = "booking-id-123",
  amount = 25
);

// Verify payment
await verifyPayment(
  paymentId = "payment-id-123",
  transactionId = "trans-123456"
);

// Leave review
await createReview(
  bookingId = "booking-id-123",
  rating = 5,
  comment = "Excellent tutor! Very helpful."
);

// Add to favorites
await addFavoriteTutor("tutor-id-123");
```

---

## 🔒 Session Management

### Session Validation

```typescript
import {
  getSessionInfo,
  validateAndRefreshSession,
} from "@/lib/sessionManager";

// Get current session info
const session = await getSessionInfo();

console.log({
  isValid: session.isValid,
  isExpired: session.isExpired,
  isExpiringSoon: session.isExpiringSoon,
  remainingSeconds: session.remainingSeconds,
});

// Validate and refresh if needed
const isValid = await validateAndRefreshSession();
```

### Auto Token Refresh

```typescript
import { refreshSessionIfNeeded } from "@/lib/sessionManager";

// Refresh token if expiring within 5 minutes
const wasRefreshed = await refreshSessionIfNeeded();
```

### Logout

```typescript
import { logOut } from "@/services/auth";
import { clearSession } from "@/lib/sessionManager";

// Simple logout
await logOut();

// Complete session clear
await clearSession();
```

---

## 🌐 Usage in Components

### Example: Admin Dashboard

```typescript
// src/app/(DashboardLayout)/@admin/dashboard/page.tsx
"use client";

import { requireAdmin } from "@/lib/authMiddleware";
import { getAdminDashboardStats, getAdminUsers } from "@/services/admin";

export default async function AdminDashboard() {
  // Verify admin access
  await requireAdmin();

  // Load data
  const statsRes = await getAdminDashboardStats();
  const usersRes = await getAdminUsers(1, 10);

  if (!statsRes.success || !usersRes.success) {
    return <div>Error loading dashboard</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="stats">
        <p>Total Revenue: ${statsRes.data?.totalRevenue}</p>
        <p>Total Users: {statsRes.data?.totalUsers}</p>
        <p>Active Sessions: {statsRes.data?.activeSessions}</p>
      </div>
      {/* Display users */}
    </div>
  );
}
```

### Example: Tutor Bookings

```typescript
// src/app/(DashboardLayout)/@tutor/dashboard/bookings/page.tsx
"use client";

import { requireTutor } from "@/lib/authMiddleware";
import { getTutorBookings, acceptBooking } from "@/services/tutor";

export default async function TutorBookings() {
  await requireTutor();

  const bookingsRes = await getTutorBookings(1, 10, "PENDING");

  const handleAccept = async (bookingId: string) => {
    const result = await acceptBooking(bookingId);
    if (result.success) {
      // Refresh or update UI
    }
  };

  return (
    <div>
      <h1>Pending Bookings</h1>
      {bookingsRes.data?.data.map((booking) => (
        <div key={booking.id}>
          <p>{booking.studentName} - {booking.subject}</p>
          <button onClick={() => handleAccept(booking.id)}>
            Accept
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Example: Student Tutor Search

```typescript
// src/app/(CommonLayout)/tutors/page.tsx
"use client";

import { requireStudent } from "@/lib/authMiddleware";
import { searchTutors, addFavoriteTutor } from "@/services/student";

export default async function FindTutors() {
  await requireStudent();

  const query = "mathematics";
  const results = await searchTutors(query, 1, 10);

  const handleAddFavorite = async (tutorId: string) => {
    const result = await addFavoriteTutor(tutorId);
    if (result.success) {
      // Show success message
    }
  };

  return (
    <div>
      <h1>Find Tutors</h1>
      {results.data?.data.map((tutor) => (
        <div key={tutor.id}>
          <h3>{tutor.name}</h3>
          <p>Subject: {tutor.subject}</p>
          <p>Rating: {tutor.averageRating}/5</p>
          <button onClick={() => handleAddFavorite(tutor.id)}>
            Add to Favorites
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🛡️ Security Best Practices

### Token Storage
- ✅ Tokens stored in HttpOnly cookies
- ✅ Secure flag enabled in production
- ✅ SameSite=Lax for CSRF protection

### Request Validation
- ✅ All API requests include authentication headers
- ✅ Ownership verification for resource access
- ✅ Role validation on sensitive operations

### Error Handling
- ✅ No sensitive info in error messages
- ✅ 401 errors trigger re-authentication
- ✅ 403 errors indicate permission denied

### Session Management
- ✅ Automatic token refresh before expiry
- ✅ Session invalidation on logout
- ✅ Multi-tab synchronization

---

## 📝 Integration Checklist

Before deploying, ensure:

- [ ] Backend endpoints match these service calls
- [ ] Token payload includes all required fields
- [ ] Middleware validates roles correctly
- [ ] CORS headers allow your frontend domain
- [ ] HttpOnly cookie setting enabled
- [ ] Refresh token endpoint implemented
- [ ] Error responses follow expected format
- [ ] All permissions validated server-side

---

## 🔧 Configuration & Environment

Update your `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
```

---

## 📚 Additional Resources

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## 🎯 Summary

This implementation provides:

✅ **Complete authentication** with access/refresh tokens
✅ **Role-based access control** for 3 user types
✅ **Comprehensive CRUD APIs** for all dashboards
✅ **Session management** with auto-refresh
✅ **Permission system** for granular access
✅ **Security best practices** for production
✅ **Easy integration** with existing components

All services are "use server" components, ensuring secure execution on the backend.
