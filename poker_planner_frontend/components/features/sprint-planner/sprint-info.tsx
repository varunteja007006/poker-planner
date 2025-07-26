import React from "react";
import { ChartBarDefault } from "./sprint-points-barchart";
import { StoriesPointsStore } from "@/store/story-points/story-points.store";

export default function SprintInfo() {
  const storyPointsData = StoriesPointsStore.useStoryPointsData();

  const storyPointsMetadata = StoriesPointsStore.useStoryPointsMetadata();

  const storyPointsGroupBy = storyPointsMetadata
    ? Object.entries(storyPointsMetadata.groupByStoryPoint).map(
        ([key, value]) => ({
          name: `${key}`,
          value: value,
        }),
      )
    : [];

  return (
    <div className="flex flex-row items-center gap-2">
      <div>
        {storyPointsData?.length ? `Votes: ${storyPointsData?.length}` : null}
      </div>
      <div>
        <div>
          {storyPointsMetadata && (
            <ChartBarDefault
              chartData={storyPointsGroupBy}
              avgPoints={storyPointsMetadata.averageStoryPoint}
            />
          )}
        </div>
      </div>
    </div>
  );
}
