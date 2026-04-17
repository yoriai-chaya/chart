"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { TEAM_COLOR_MAP, UI_LABEL } from "../app-config";

type ApiResponse = {
  fileName: string;
  totalCount: number;
  projectCounts: Record<string, number>;
};

type ChartRow = {
  name: string;
  value: number;
  fill: string;
};

export const DonutChart = () => {
  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchIssues = async () => {
      const res = await fetch("/api/issues");
      const data: ApiResponse = await res.json();
      console.log("API response:", data);
      const transformed = Object.entries(data.projectCounts).map(
        ([name, value]) => ({
          name,
          value,
          fill:
            TEAM_COLOR_MAP[name as keyof typeof TEAM_COLOR_MAP] ??
            "var(--muted)",
        }),
      );
      console.log("transformed: ", transformed);
      setChartData(transformed);
      setTotalCount(data.totalCount);
    };
    fetchIssues();
  }, []);

  const chartConfig = Object.fromEntries(
    chartData.map((item) => [
      item.name,
      {
        label: item.name,
        color: item.fill,
      },
    ]),
  );

  return (
    <Card className="flex flex-col h-full card-base">
      <CardHeader className="items-center pb-0">
        <CardTitle>{UI_LABEL.donut_chart.issueTitle}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative mx-auto h-45 w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                strokeWidth={1}
              />
              <ChartLegend
                content={
                  <ChartLegendContent className="flex-col items-start gap-1" />
                }
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  right: 10,
                }}
              />
            </PieChart>
          </ChartContainer>

          {/* absolute overlay */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center -translate-x-5">
            <div className="text-4xl font-bold text-foreground">
              {totalCount}
            </div>
            <div className="text-xs text-muted-foreground">
              {UI_LABEL.donut_chart.issueUnit}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
