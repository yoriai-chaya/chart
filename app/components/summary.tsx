"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_LABEL, UI_LABEL } from "@/app/app-config";
import { useTeamFilterQuery } from "../useTeamFilterQuery";

type SummaryResponse = {
  current: {
    total: number;
    completed: number;
    incomplete: number;
    new: number;
    breakdown: {
      in_progress: number;
      investigating: number;
      researching: number;
      on_hold: number;
    };
  };
  diff: {
    total: number;
    completed: number;
    incomplete: number;
    new: number;
    breakdown: {
      in_progress: number;
      investigating: number;
      researching: number;
      on_hold: number;
    };
  };
  currentDate: string;
  previousDate: string;
};

type SummaryRowProps = {
  label: string;
  value: number;
  diff: number;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const formatDiff = (diff: number): string => {
  if (diff > 0) return `+${diff}`;
  if (diff < 0) return `${diff}`;
  return "0";
};

const Row = ({ label, value, diff }: SummaryRowProps) => (
  <div className="grid grid-cols-4 px-6">
    <div className="col-span-2">{label}</div>
    <div className="col-span-1 text-right tabular-nums">
      {value}
      {UI_LABEL.summary.unit}
    </div>
    <div className="col-span-1 text-right tabular-nums">
      {formatDiff(diff)}
      {UI_LABEL.summary.unit}
    </div>
  </div>
);

export const Summary = () => {
  const query = useTeamFilterQuery();
  const { data, isLoading } = useSWR<SummaryResponse>(
    `/api/summary${query}`,
    fetcher,
  );

  if (isLoading || !data) return <div>Loading...</div>;

  const { current, diff } = data;

  return (
    <Card className="h-full card-base">
      <CardHeader>
        <CardTitle>{UI_LABEL.summary.summaryTitle}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-0.5 text-sm">
        <div className="grid grid-cols-4 px-6 pb-1 border-b text-xs font-medium text-muted-foreground">
          <div className="col-span-2">{UI_LABEL.summary.header.status}</div>
          <div className="col-span-1 text-right">
            {UI_LABEL.summary.header.current}
          </div>
          <div className="col-span-1 text-right">
            {UI_LABEL.summary.header.diff}
          </div>
        </div>
        <Row
          label={STATUS_LABEL.total}
          value={current.total}
          diff={diff.total}
        />
        <Row
          label={STATUS_LABEL.completed}
          value={current.completed}
          diff={diff.completed}
        />
        <Row
          label={STATUS_LABEL.incomplete}
          value={current.incomplete}
          diff={diff.incomplete}
        />

        <div className="text-xs pl-4 text-muted-foreground">
          <Row
            label={STATUS_LABEL.in_progress}
            value={current.breakdown.in_progress}
            diff={diff.breakdown.in_progress}
          />
          <Row
            label={STATUS_LABEL.investigating}
            value={current.breakdown.investigating}
            diff={diff.breakdown.investigating}
          />
          <Row
            label={STATUS_LABEL.researching}
            value={current.breakdown.researching}
            diff={diff.breakdown.researching}
          />
          <Row
            label={STATUS_LABEL.on_hold}
            value={current.breakdown.on_hold}
            diff={diff.breakdown.on_hold}
          />
        </div>

        <Row label={STATUS_LABEL.new} value={current.new} diff={diff.new} />

        <div className="pt-2 text-[10px] text-muted-foreground text-right">
          {UI_LABEL.summary.footer.current}: {data.currentDate} /{" "}
          {UI_LABEL.summary.footer.previous}:{data.previousDate}
        </div>
      </CardContent>
    </Card>
  );
};
