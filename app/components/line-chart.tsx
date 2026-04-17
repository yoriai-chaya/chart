"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { STATUS_LABEL, STATUS_COLOR_MAP, UI_LABEL } from "../app-config";

type WeeklyIssueSummary = {
  date: string;
  total: number;
  newIssue: number;
  inProgress: number;
  completed: number;
};

const chartConfig = {
  total: {
    label: "総数",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const IssuesLineChart = () => {
  const [chartData, setChartData] = useState<WeeklyIssueSummary[]>([]);

  useEffect(() => {
    const fetchWeeklyIssues = async () => {
      const res = await fetch("/api/issues/weekly");
      const data: WeeklyIssueSummary[] = await res.json();
      setChartData(data);
    };

    fetchWeeklyIssues();
  }, []);

  return (
    <Card className="bg-surface text-foreground card-base">
      <CardHeader>
        <CardTitle>{UI_LABEL.line_chart.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60 rounded-xl">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 20, right: 40, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="none"
                wrapperStyle={{
                  lineHeight: "6px",
                  paddingLeft: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                formatter={(value: string, entry: { color?: string }) => {
                  return (
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: entry.color,
                          display: "inline-block",
                        }}
                      />
                      {value}
                    </span>
                  );
                }}
              />
              <Line
                type="natural"
                dataKey="total"
                name={STATUS_LABEL.total}
                stroke={STATUS_COLOR_MAP.total}
                strokeWidth={2}
                dot={{
                  fill: "var(--status-total)",
                }}
              />
              <Line
                type="monotone"
                dataKey="newIssue"
                name={STATUS_LABEL.new}
                stroke={STATUS_COLOR_MAP.new}
                strokeWidth={2}
                dot={{
                  fill: "var(--status-new)",
                }}
              />
              <Line
                type="monotone"
                dataKey="inProgress"
                name={STATUS_LABEL.incomplete}
                stroke={STATUS_COLOR_MAP.incomplete}
                strokeWidth={2}
                dot={{
                  fill: "var(--status-incomplete)",
                }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                name={STATUS_LABEL.completed}
                stroke={STATUS_COLOR_MAP.completed}
                strokeWidth={2}
                dot={{
                  fill: "var(--status-completed)",
                }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
