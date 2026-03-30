export type UserRole = "ADMIN" | "STUDENT" | "TUTOR";

export const authRoutes = [ "/login", "/register", "/forgot-password", "/reset-password", "/verify-email" ];

export const isAuthRoute = (pathname : string) => {
    return authRoutes.some((router : string) => router === pathname);
}

export type RouteConfig = {
    exact : string[],
    pattern : RegExp[]
}

export const commonProtectedRoutes : RouteConfig = {
    exact : ["/my-profile", "/change-password", "/dashboard"],
    pattern : [/^\/dashboard(\/.*)?$/ ] // Matches /dashboard and /dashboard/*
}

export const tutorProtectedRoutes : RouteConfig = {
    pattern: [], // All tutor routes are now under /dashboard (COMMON)
    exact : []
}

export const adminProtectedRoutes : RouteConfig = {
    pattern: [], // All admin routes are now under /dashboard (COMMON)
    exact : []
}

// export const superAdminProtectedRoutes : RouteConfig = {
//     pattern: [/^\/admin\/dashboard/ ], // Matches any path that starts with /super-admin/dashboard
//     exact : []
// }

export const studentProtectedRoutes : RouteConfig = {
    pattern: [], // /dashboard is now in COMMON routes
    exact : [ "/payment/success"]
};

export const isRouteMatches = (pathname : string, routes : RouteConfig) => {
    if(routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern : RegExp) => pattern.test(pathname));
}

export const getRouteOwner = (pathname : string) : "ADMIN" | "TUTOR" | "STUDENT" | "COMMON" | null => {
    if(isRouteMatches(pathname, tutorProtectedRoutes)) {
        return "TUTOR";
    }

    // if (isRouteMatches(pathname, superAdminProtectedRoutes)) {
    //     return "SUPER_ADMIN";
    // }

    if(isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    
    if(isRouteMatches(pathname, studentProtectedRoutes)) {
        return "STUDENT";
    }

    if(isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    return null; // public route
}

export const getDefaultDashboardRoute = (role : UserRole) => {
    return "/dashboard"; // All roles access /dashboard, layout.tsx handles showing correct content
}

// export const isValidRedirectForRole = (redirectPath : string, role : UserRole) => {
//     const unifySuperAdminAndAdminRole = role === "SUPER_ADMIN" ? "ADMIN" : role;

//     role = unifySuperAdminAndAdminRole;

//     const sanitizedRedirectPath = redirectPath.split("?")[0] || redirectPath;
//     const routeOwner = getRouteOwner(sanitizedRedirectPath);

//     if(routeOwner === null || routeOwner === "COMMON"){
//         return true;
//     }

//     if(routeOwner === role){
//         return true;
//     }

//     return false;
// }