import { memo } from "react";
import { Button } from "../ui/button";
import logOut from "@/actions/auth/logout";
import { toaster } from "../ui/toaster";
import { useRouter } from "next/navigation";

function SettingTemplate() {
  const router = useRouter();

  async function handleLogOut() {
    const userLogOut = await logOut();
    if (userLogOut?.success) {
      toaster.create({
        title: "User Logged Out",
        type: "success",
      });
      return router.push("/login");
    }
    return toaster.create({
      title: userLogOut?.error,
      type: "error",
    });
  }
  return (
    <Button variant="solid" onClick={handleLogOut}>
      Log out
    </Button>
  );
}

export default memo(SettingTemplate);
