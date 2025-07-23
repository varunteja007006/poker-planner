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

export const description = "A bar chart";

const chartConfig = {
  value: {
    label: "Votes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartBarDefault({
  avgPoints = 0,
  chartData,
}: {
  avgPoints: number;
  chartData: {
    name: string;
    value: number;
  }[];
}) {
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
          <BarChart accessibilityLayer data={chartData}>
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
                  payload={chartData}
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
          Average points: {avgPoints}
        </div>
      </DialogContent>
    </Dialog>
  );
}
