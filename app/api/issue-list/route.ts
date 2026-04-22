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

    const csvFiles = files.filter((file) => /^\d{8}\.csv$/.test(file)).sort();

    const latestFile = csvFiles[csvFiles.length - 1];

    if (!latestFile) {
      return NextResponse.json([], { status: 200 });
    }

    const filePath = path.join(csvDir, latestFile);
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

    return NextResponse.json(filteredRows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to get the CSV files" },
      { status: 500 },
    );
  }
}
