import { describe, expect, it } from "vitest";
import type { MatchSummary } from "@/types/match";
import type { VideoPost } from "@/types/video";
import { getMatchRelatedVideos, parseVideoEmbed } from "@/lib/utils/video";

describe("video utils", () => {
  it("parses youtube, direct video files, and fallback external links", () => {
    expect(parseVideoEmbed("https://www.youtube.com/watch?v=aqz-KE-bpKQ")).toEqual({
      kind: "youtube",
      videoId: "aqz-KE-bpKQ",
      embedUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?rel=0&modestbranding=1&playsinline=1"
    });
    expect(parseVideoEmbed("https://youtu.be/jNQXAC9IVRw")).toEqual({
      kind: "youtube",
      videoId: "jNQXAC9IVRw",
      embedUrl: "https://www.youtube.com/embed/jNQXAC9IVRw?rel=0&modestbranding=1&playsinline=1"
    });
    expect(
      parseVideoEmbed("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4")
    ).toEqual({
      kind: "native",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    });
    expect(parseVideoEmbed("https://example.com/live/channel-1")).toEqual({
      kind: "external",
      href: "https://example.com/live/channel-1"
    });
  });

  it("prioritizes match and series related videos above unrelated clips", () => {
    const match: MatchSummary = {
      id: "match-fb-2001",
      status: "live",
      format: "Football",
      seriesName: "UEFA Champions League",
      venue: "Santiago Bernabeu",
      teamA: { id: "team-rma", name: "Real Madrid", shortName: "RMA" },
      teamB: { id: "team-bar", name: "FC Barcelona", shortName: "BAR" }
    };

    const videos: VideoPost[] = [
      {
        id: "v-1",
        title: "NBA Finals Game 6 Highlights",
        description: "Basketball late fourth quarter action",
        videoUrl: "https://example.com/nba.mp4",
        createdAt: "2026-11-22T00:00:00Z",
        updatedAt: "2026-11-22T00:00:00Z"
      },
      {
        id: "v-2",
        title: "Real Madrid vs FC Barcelona Champions League Extended Highlights",
        description: "Full goals from the Bernabeu UCL clash",
        videoUrl: "https://example.com/el-clasico.mp4",
        createdAt: "2026-11-22T00:00:00Z",
        updatedAt: "2026-11-22T00:00:00Z"
      }
    ];

    const { matchRelated, otherVideos } = getMatchRelatedVideos(match, videos);
    expect(matchRelated.map((v) => v.id)).toEqual(["v-2"]);
    expect(otherVideos.map((v) => v.id)).toEqual(["v-1"]);
  });
});
