"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

export const description = "Token/day per team";

const chartData = [
  { date: "2025-03-15", platformEng: 98200, backendCore: 72000, mobile: 41000, devSecOps: 28000 },
  { date: "2025-03-16", platformEng: 87400, backendCore: 68200, mobile: 38500, devSecOps: 21000 },
  { date: "2025-03-17", platformEng: 52000, backendCore: 31000, mobile: 19000, devSecOps: 9000 },
  { date: "2025-03-18", platformEng: 48000, backendCore: 29000, mobile: 17500, devSecOps: 8500 },
  { date: "2025-03-19", platformEng: 103400, backendCore: 79500, mobile: 44800, devSecOps: 31200 },
  { date: "2025-03-20", platformEng: 118200, backendCore: 88000, mobile: 51200, devSecOps: 34000 },
  { date: "2025-03-21", platformEng: 125800, backendCore: 92400, mobile: 53400, devSecOps: 36800 },
  { date: "2025-03-22", platformEng: 112400, backendCore: 81200, mobile: 47200, devSecOps: 29600 },
  { date: "2025-03-23", platformEng: 108000, backendCore: 78800, mobile: 45800, devSecOps: 27200 },
  { date: "2025-03-24", platformEng: 54000, backendCore: 32000, mobile: 20000, devSecOps: 10000 },
  { date: "2025-03-25", platformEng: 51000, backendCore: 30500, mobile: 18500, devSecOps: 9500 },
  { date: "2025-03-26", platformEng: 129600, backendCore: 96200, mobile: 54800, devSecOps: 38400 },
  { date: "2025-03-27", platformEng: 138000, backendCore: 102000, mobile: 58200, devSecOps: 41200 },
  { date: "2025-03-28", platformEng: 144400, backendCore: 107800, mobile: 62000, devSecOps: 44000 },
  { date: "2025-03-29", platformEng: 136200, backendCore: 99600, mobile: 57400, devSecOps: 39800 },
  { date: "2025-03-30", platformEng: 131800, backendCore: 95000, mobile: 55600, devSecOps: 37200 },
  { date: "2025-03-31", platformEng: 55000, backendCore: 33000, mobile: 21000, devSecOps: 11000 },
  { date: "2025-04-01", platformEng: 52000, backendCore: 31500, mobile: 19500, devSecOps: 10500 },
  { date: "2025-04-02", platformEng: 148600, backendCore: 112000, mobile: 64200, devSecOps: 46800 },
  { date: "2025-04-03", platformEng: 156200, backendCore: 118400, mobile: 68000, devSecOps: 49600 },
  { date: "2025-04-04", platformEng: 161800, backendCore: 122000, mobile: 71200, devSecOps: 51200 },
  { date: "2025-04-05", platformEng: 152400, backendCore: 114800, mobile: 66400, devSecOps: 47600 },
  { date: "2025-04-06", platformEng: 147000, backendCore: 110000, mobile: 63200, devSecOps: 44800 },
  { date: "2025-04-07", platformEng: 58000, backendCore: 35000, mobile: 22500, devSecOps: 12500 },
  { date: "2025-04-08", platformEng: 55000, backendCore: 33000, mobile: 21000, devSecOps: 11500 },
  { date: "2025-04-09", platformEng: 163400, backendCore: 124800, mobile: 73200, devSecOps: 53600 },
  { date: "2025-04-10", platformEng: 171000, backendCore: 131200, mobile: 77000, devSecOps: 56800 },
  { date: "2025-04-11", platformEng: 178600, backendCore: 138000, mobile: 81200, devSecOps: 60400 },
  { date: "2025-04-12", platformEng: 168200, backendCore: 128400, mobile: 75400, devSecOps: 55200 },
  { date: "2025-04-13", platformEng: 162000, backendCore: 122800, mobile: 72000, devSecOps: 52000 },
];

const chartConfig = {
  platformEng: {
    label: "Platform Eng.",
    color: "var(--chart-1)",
  },
  backendCore: {
    label: "Backend Core",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-3)",
  },
  devSecOps: {
    label: "DevSecOps",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2025-04-13");
    let daysToSubtract = 30;
    if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Token/day per team</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            15 mar – 13 apr 2025
          </span>
          <span className="@[540px]/card:hidden">Ultimi 30 giorni</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            multiple={false}
            value={timeRange ? [timeRange] : []}
            onValueChange={(value) => {
              setTimeRange(value[0] ?? "30d");
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="30d">Ultimi 30 giorni</ToggleGroupItem>
            <ToggleGroupItem value="7d">Ultimi 7 giorni</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (value !== null) {
                setTimeRange(value);
              }
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Ultimi 30 giorni" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="30d" className="rounded-lg">
                Ultimi 30 giorni
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Ultimi 7 giorni
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPlatformEng" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-platformEng)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-platformEng)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillBackendCore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-backendCore)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-backendCore)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillDevSecOps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-devSecOps)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-devSecOps)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("it-IT", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("it-IT", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="devSecOps"
              type="natural"
              fill="url(#fillDevSecOps)"
              stroke="var(--color-devSecOps)"
              stackId="a"
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="backendCore"
              type="natural"
              fill="url(#fillBackendCore)"
              stroke="var(--color-backendCore)"
              stackId="a"
            />
            <Area
              dataKey="platformEng"
              type="natural"
              fill="url(#fillPlatformEng)"
              stroke="var(--color-platformEng)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
