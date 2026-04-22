import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { STATUS_FROM_CSV, STATUS_GROUP } from "@/app/app-config";

type Issue = {
  status: string;
  team: string;
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

function summarize(data: Issue[], selectedTeams: string[]) {
  const filtered =
    selectedTeams.length === 0
      ? data
      : data.filter((row) => selectedTeams.includes(row.team));

  const counts: Record<string, number> = {};

  filtered.forEach((row) => {
    const key = STATUS_FROM_CSV[row.status];
    if (!key) return;

    counts[key] = (counts[key] || 0) + 1;
  });

  const total = filtered.length;

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teamsParam = searchParams.get("teams");

    const selectedTeams = teamsParam ? teamsParam.split(",") : [];

    const { current, previous } = getLatestTwoFiles();

    const currentData = parseCSV(current);
    const previousData = parseCSV(previous);

    const currentSummary = summarize(currentData, selectedTeams);
    const previousSummary = summarize(previousData, selectedTeams);

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
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
