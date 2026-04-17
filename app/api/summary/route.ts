import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { STATUS_FROM_CSV, STATUS_GROUP } from "@/app/app-config";

type Issue = {
  status: string;
};

const CSV_DIR = path.join(process.cwd(), "public/csv");

function getLatestTwoFiles() {
  const files = fs
    .readdirSync(CSV_DIR)
    .filter((f) => f.endsWith(".csv"))
    .sort()
    .reverse();

  return {
    current: files[0],
    previous: files[1],
  };
}

function parseCSV(fileName: string): Issue[] {
  const filePath = path.join(CSV_DIR, fileName);
  const content = fs.readFileSync(filePath, "utf-8");

  const result = Papa.parse<Issue>(content, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data;
}

function summarize(data: Issue[]) {
  const counts: Record<string, number> = {};

  data.forEach((row) => {
    const key = STATUS_FROM_CSV[row.status];
    if (!key) return;

    counts[key] = (counts[key] || 0) + 1;
  });

  const total = data.length;

  const incomplete = STATUS_GROUP.INCOMPLETE.reduce(
    (sum, key) => sum + (counts[key] || 0),
    0,
  );

  return {
    total,
    completed: counts["completed"] || 0,
    new: counts["new"] || 0,
    incomplete,
    breakdown: {
      in_progress: counts["in_progress"] || 0,
      investigating: counts["investigating"] || 0,
      researching: counts["researching"] || 0,
      on_hold: counts["on_hold"] || 0,
    },
  };
}

export async function GET() {
  const { current, previous } = getLatestTwoFiles();

  const currentData = parseCSV(current);
  const previousData = parseCSV(previous);

  const currentSummary = summarize(currentData);
  const previousSummary = summarize(previousData);

  const diff = (a: number, b: number) => a - b;

  return NextResponse.json({
    currentDate: current.replace(".csv", ""),
    previousDate: previous.replace(".csv", ""),

    current: currentSummary,
    previous: previousSummary,

    diff: {
      total: diff(currentSummary.total, previousSummary.total),
      completed: diff(currentSummary.completed, previousSummary.completed),
      new: diff(currentSummary.new, previousSummary.new),
      incomplete: diff(currentSummary.incomplete, previousSummary.incomplete),
      breakdown: {
        in_progress: diff(
          currentSummary.breakdown.in_progress,
          previousSummary.breakdown.in_progress,
        ),
        investigating: diff(
          currentSummary.breakdown.investigating,
          previousSummary.breakdown.investigating,
        ),
        researching: diff(
          currentSummary.breakdown.researching,
          previousSummary.breakdown.researching,
        ),
        on_hold: diff(
          currentSummary.breakdown.on_hold,
          previousSummary.breakdown.on_hold,
        ),
      },
    },
  });
}
