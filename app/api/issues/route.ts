import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teamsParam = searchParams.get("teams");

    const selectedTeams = teamsParam ? teamsParam.split(",") : [];

    const csvDir = path.join(process.cwd(), "public", "csv");

    const files = await fs.readdir(csvDir);

    const csvFiles = files
      .filter((file) => file.endsWith(".csv"))
      .sort()
      .reverse();

    if (csvFiles.length === 0) {
      return NextResponse.json(
        { message: "CSV file not found" },
        { status: 404 },
      );
    }

    const latestFile = csvFiles[0];
    const filePath = path.join(csvDir, latestFile);

    const csvText = await fs.readFile(filePath, "utf-8");

    const parsed = Papa.parse<IssueRow>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const rows = parsed.data;

    // for filter
    const filteredRows =
      selectedTeams.length === 0
        ? rows
        : rows.filter((row) => selectedTeams.includes(row.team));

    const projectCounts: Record<string, number> = {};

    filteredRows.forEach((row) => {
      const project = row.team || "not-set";
      projectCounts[project] = (projectCounts[project] ?? 0) + 1;
    });

    return NextResponse.json({
      fileName: latestFile,
      totalCount: filteredRows.length,
      projectCounts,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
