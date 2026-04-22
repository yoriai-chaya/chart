"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { UI_LABEL } from "../app-config";
import { useTeamFilterQuery } from "../useTeamFilterQuery";
import { getTeamMeta } from "../team";

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

  const query = useTeamFilterQuery();

  useEffect(() => {
    const fetchIssues = async () => {
      const res = await fetch(`/api/issues${query}`);
      const data: ApiResponse = await res.json();
      console.log("API response:", data);

      const chartData = Object.entries(data.projectCounts).map(
        ([csvName, value]) => {
          const meta = getTeamMeta(csvName);
          return {
            name: meta?.label ?? csvName,
            value,
            fill: meta?.color ?? "var(--muted)",
          };
        },
      );
      setChartData(chartData);
      setTotalCount(data.totalCount);
    };
    fetchIssues();
  }, [query]);

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
                innerRadius={36}
                outerRadius={75}
                strokeWidth={1}
                labelLine={false}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  name,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const safeMidAngle = midAngle ?? 0;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 1.2;

                  const x = cx + radius * Math.cos(-safeMidAngle * RADIAN);
                  const y = cy + radius * Math.sin(-safeMidAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="currentColor"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      className="text-xs"
                    >
                      {name}: {value}
                    </text>
                  );
                }}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalCount}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 18}
                            className="fill-muted-foreground text-xs"
                          >
                            {UI_LABEL.donut_chart.issueUnit}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
