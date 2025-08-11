"use client";

import React from "react";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useSocketContext } from "@/providers/socket-provider";

const chartConfig = {
  value: {
    label: "Votes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartBarDefault() {
  const [stats, setStats] = React.useState<{
    chartData: { name: string; value: number }[] | [];
    avgPoints: number;
  } | null>({
    chartData: [],
    avgPoints: 0,
  });

  const { socket } = useSocketContext();

  // Whenever a story is created reset the selected card
  React.useEffect(() => {
    if (socket) {
      socket.on("story:updated", (res) => {
        setStats({
          chartData: res.groupByStoryPointArray,
          avgPoints: res.averageStoryPoint,
        });
      });
      socket.on("story:created", (_res) => {
        setStats({
          chartData: [],
          avgPoints: 0,
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("story:updated");
        socket.off("story:created");
      }
    };
  }, [socket]);

  if (
    !stats ||
    !Array.isArray(stats?.chartData) ||
    stats.chartData.length === 0
  ) {
    return null;
  }

  return (
    <Dialog defaultOpen={true}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Results</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Results</DialogTitle>
          <DialogDescription>
            Users have voted on the story points. The chart below shows the
            distribution of votes.
          </DialogDescription>
        </DialogHeader>

        <ChartContainer className="h-[240px]" config={chartConfig}>
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
        <div className="flex gap-2 leading-none font-medium">
          Average points: {stats.avgPoints}
        </div>
      </DialogContent>
    </Dialog>
  );
}
