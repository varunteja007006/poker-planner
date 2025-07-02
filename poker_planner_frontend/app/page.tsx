import UserRegistration from "@/components/features/sprint-planner/UserRegistration";

export default function Home() {
  return (
    <div className="flex flex-col h-full w-full md:flex-row">
      <div className="w-1/2 h-full">
        <h1 className="text-primary text-5xl p-10">Welcome to Poker Planner</h1>
      </div>
      <div className="w-1/2  h-full p-10">
        <UserRegistration />
      </div>
    </div>
  );
}
