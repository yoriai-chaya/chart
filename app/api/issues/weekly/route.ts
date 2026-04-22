import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";

import { csvToStatusKey, summarizeStatuses } from "@/app/status";

type IssueRow = {
  issueID: string;
  createdAt: string;
  createdBy: string;
  title: string;
  category: string;
  team: string;
  status: string;
  description: string;
  resolutionStatus: string;
  completedAt: string;
};

type WeeklyIssueSummary = {
  date: string;
  total: number;
  new: number;
  incomplete: number;
  completed: number;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teamsParam = searchParams.get("teams");

    const selectedTeams = teamsParam ? teamsParam.split(",") : [];

    const csvDir = path.join(process.cwd(), "public", "csv");
    const files = await fs.readdir(csvDir);

    const csvFiles = files.filter((file) => /^\d{8}\.csv$/.test(file)).sort();

    const result: WeeklyIssueSummary[] = [];

    for (const file of csvFiles) {
      const filePath = path.join(csvDir, file);
      const csvText = await fs.readFile(filePath, "utf-8");

      const parsed = Papa.parse<IssueRow>(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      const rows = parsed.data;

      const filteredRows =
        selectedTeams.length === 0
          ? rows
          : rows.filter((row) => selectedTeams.includes(row.team));

      const statusKeys = filteredRows
        .map((row) => csvToStatusKey(row.status?.trim() ?? ""))
        .filter((s): s is NonNullable<typeof s> => s !== null);

      const summary = summarizeStatuses(statusKeys);

      const date = `${file.slice(0, 4)}/${file.slice(4, 6)}/${file.slice(
        6,
        8,
      )}`;

      result.push({
        date,
        ...summary,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
