import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUserStore } from "@/store/user.store";

const chartConfig = {
  value: {
    label: "Votes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function PokerResults({
  storyId,
}: Readonly<{
  storyId: Id<"stories"> | null;
}>) {
  const { userToken } = useUserStore();

  const result = useQuery(
    api.storyPoints.getStoryPointsStats,
    storyId && userToken ? { token: userToken, storyId } : "skip"
  );

  if (!storyId) {
    return null;
  }

  if (!result?.success) {
    return <div>Error: {result?.message || "Failed to load results"}</div>;
  }

  const stats = {
    chartData: result.chartData || [],
    avgPoints: result.avgPoints || 0,
  };

  if (stats.chartData.length === 0) {
    return <div>No votes yet.</div>;
  }

  return (
    <div className="flex flex-row gap-4 items-start p-2">
      <div className="flex gap-2 p-2 leading-none font-medium">
        Average points: {stats.avgPoints}
      </div>
      <div className="p-2 border">
        <ChartContainer className="h-[240px] w-fit" config={chartConfig}>
          <BarChart accessibilityLayer data={stats.chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  coordinate={{
                    x: 0,
                    y: 0,
                  }}
                  payload={stats.chartData}
                  accessibilityLayer
                  active
                  hideLabel
                />
              }
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={8} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
