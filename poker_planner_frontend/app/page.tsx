import UserRegistration from "@/components/features/sprint-planner/user-registration";

export default function Home() {
  return (
    <div className="flex flex-col h-full w-full md:flex-row">
      <div className="w-1/2 h-full min-h-[80vh] p-10 flex flex-col items-center justify-center">
        <h1 className="text-primary text-5xl">Welcome to Poker Planner</h1>
      </div>
      <div className="w-1/2  h-full min-h-[80vh] p-10 flex flex-col items-center justify-center">
        <div className="min-w-lg">
          <UserRegistration />
        </div>
      </div>
    </div>
  );
}
