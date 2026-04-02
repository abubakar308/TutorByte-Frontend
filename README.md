# TutorByte Frontend

**🌍 Live Demo:** [https://tutorbyte.vercel.app/](https://tutorbyte.vercel.app/)

Welcome to the **TutorByte Frontend** repository! TutorByte is a modern, comprehensive learning and tutoring platform connecting students with expert tutors. This project serves as the client-side application built with cutting-edge web technologies, delivering distinct dashboard experiences for Students, Tutors, and Administrators.

## 🚀 Technologies Used

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Authentication:** JWT-based Auth
- **Toasts/Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Language:** TypeScript

## ✨ Key Features

- **Role-Based Dashboards:** Dedicated, responsive dashboard experiences for **Students**, **Tutors**, and **Admins**.
- **Unified User Profiles:** Consistent tracking of join dates, updates, user details, and role designations.
- **Booking Management:** Seamlessly schedule, track, and manage tutoring sessions.
- **Integrated Payments:** A robust, reusable component to track payment history for all user roles.
- **Secure Authentication:** Reliable authentication context providing seamless state routing for diverse platform roles.
- **Modern UI/UX Aesthetic:** A visually appealing interface engineered with responsive layouts and smooth micro-interactions.

## 📂 Project Structure

A quick overview of the core file structure:

```bash
tutorbyte-frontend/
├── src/
│   ├── app/           # Next.js App Router layout structure and route definitions
│   ├── components/    # Reusable UI components (auth, layouts, dashboards, widgets)
│   ├── lib/           # Common utilities (e.g. Tailwind class combiners)
│   ├── services/      # External API handlers and state mutations (auth, profile)
│   └── types/         # TypeScript interfaces and shared type resources
├── package.json       # Project dependencies and script runner configurations
└── postcss.config.mjs # CSS compiler config for Tailwind CSS
```

## 🛠️ Getting Started

Follow these steps to get the environment running locally on your machine.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your local environment.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abubakar308/TutorByte-Frontend
   cd tutorbyte-frontend
   ```

2. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. **Environment Setup:**
    Create a `.env.local` file in the root directory and align it with the required backend platform API variables.
    ```env
    NEXT_PUBLIC_BASE_API_URL=http://localhost:5000/api
    ```
    *(Note: Refer to backend environment variables schema for comprehensive API setups if applicable)*

4. **Start the development server:**
    ```bash
    npm run dev
    ```

5. **Open the Application:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

## 🤝 Contribution

Contributions to extend the TutorByte network are always welcome! Feel free to review the architecture style, keep strict type adherence with TypeScript, and document extensive changes clearly within Pull Requests.

---

*This application aims to provide a next-level development experience integrating tutors and learning communities securely.*
