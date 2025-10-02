import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUserStore } from "@/store/user.store";
import { useParams } from "react-router";

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
  const params = useParams();
  const roomCode = params?.roomCode;
  const result = useQuery(
    api.storyPoints.getStoryPointsStats,
    storyId && userToken
      ? { token: userToken, storyId }
      : { token: userToken, roomCode }
  );

  if (!result?.success) {
    return <div>Error: {result?.message || "Failed to load results"}</div>;
  }

  const stats = {
    chartData: result.chartData || [],
    avgPoints: result.avgPoints || 0,
    totalVoters: result.totalVoters,
  };

  if (stats.chartData.length === 0) {
    return <div>No votes yet.</div>;
  }

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col gap-4 items-stretch">
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Points</TableHead>
                <TableHead>Votes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.chartData.map((item) => (
                <TableRow key={item.name}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col items-stretch gap-2">
          <div className="flex gap-2">
            Average points: <span className="font-bold">{stats.avgPoints}</span>
          </div>
          <div className="flex gap-2">
            Voters: <span className="font-bold">{stats.totalVoters}</span>
          </div>
        </div>
      </div>
      <div className="p-2 border flex-1">
        <ChartContainer
          className="h-[240px] w-fit mx-auto"
          config={chartConfig}
        >
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
