import { UserRound } from "lucide-react";

function ProfilePage() {
  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="font-bold text-4xl text-gray-500 dark:text-gray-400">Profile</h1>
        <UserRound className="w-16 h-16 text-gray-400 dark:text-gray-500" />
        <p className="text-lg text-gray-500">Jane Doe</p>
      </div>
    </div>
  );
}

export default ProfilePage;
