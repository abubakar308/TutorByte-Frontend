import { getCurrentUser } from '@/services/auth';

import React from 'react';

 export const dynamic = "force-dynamic";

const DashboardLayout =async ({admin,student,tutor}:{admin:React.ReactNode;student:React.ReactNode,tutor:React.ReactNode}) => {
    const user = await getCurrentUser();

    const Roles = user?.role;
    return (
        <div>
           {Roles=== "STUDENT" && student}
           {Roles=== "TUTOR" && tutor}
           {Roles=== "ADMIN" && admin}
        </div>
    );
};

export default DashboardLayout;