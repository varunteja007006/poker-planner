import { getEmojiForUserId } from "@/lib/utils";

export default function ParticipantCard({
  name,
  online,
  hasVoted,
  lastDisconnected,
  emojiId,
}: Readonly<{
  name: string;
  online: boolean;
  hasVoted: boolean;
  lastDisconnected?: number;
  emojiId: string;
}>) {
  return (
    <div className="border-primary/25 flex w-full flex-row items-center justify-between gap-2 overflow-hidden rounded-md border bg-white p-2 pr-4 pl-2 shadow dark:bg-secondary">
      <div className="flex flex-row items-center gap-2">
        <div className="text-2xl">{getEmojiForUserId(emojiId)}</div>
        <div className="flex flex-col items-start">
          <p className="truncate overflow-hidden text-sm text-ellipsis capitalize text-primary font-semibold">
            {name}
          </p>

          {online ? (
            <p className="text-xs text-green-600 font-semibold">{`Online`}</p>
          ) : (
            lastDisconnected && (
              <p className="text-xs">{getTimeAgo(lastDisconnected)}</p>
            )
          )}
        </div>
      </div>
      <div>{hasVoted && <div className="animate-bounce">👍</div>}</div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);

  if (diff < 60) return "Last seen just now";
  if (diff < 3600) return `Last seen ${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `Last seen ${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.floor(diff / 86400);
  return `Last seen ${days} day${days === 1 ? "" : "s"} ago`;
}
