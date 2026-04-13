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
    <Card className="bg-surface text-foreground">
      <CardHeader>
        <CardTitle>Weekly Issue Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60 rounded-xl">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 40, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
              <Line
                type="monotone"
                dataKey="total"
                name="総数"
                stroke="var(--chart-1)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="newIssue"
                name="新規/未着手"
                stroke="var(--chart-2)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="inProgress"
                name="未完了"
                stroke="var(--chart-3)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="completed"
                name="完了"
                stroke="var(--chart-4)"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
