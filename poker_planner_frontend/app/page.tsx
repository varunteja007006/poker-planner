import UserRegistration from "@/components/features/sprint-planner/user-registration";

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <div className="flex h-full min-h-[40vh] md:min-h-[80vh] w-full md:w-1/2 flex-col items-center justify-center p-5 md:p-10">
        <h1 className="text-primary text-5xl">Welcome to Poker Planner</h1>
      </div>
      <div className="flex h-full min-h-[40vh] md:min-h-[80vh] w-full md:w-1/2 flex-col items-center justify-center p-5 md:p-10">
        <div className="min-w-lg">
          <UserRegistration />
        </div>
      </div>
    </div>
  );
}
