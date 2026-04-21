import ProfilePage from "@/components/ui/shared/ProfilePage";
import { getUserInfo } from "@/services/auth";
import { redirect } from "next/navigation";

const page = async () => {
    const user = await getUserInfo();

    if (!user) {
        redirect("/login");
    }

    return (
        <div>
            <ProfilePage initialData={user} />
        </div>
    );
};

export default page;