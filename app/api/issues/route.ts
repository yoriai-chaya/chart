import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";

type IssueRow = {
  IssueID: string;
  createdAt: string;
  createdBy: string;
  title: string;
  category: string;
  projectName: string;
  status: string;
  description: string;
  resolutionStatus: string;
  completedAt: string;
};

export async function GET() {
  try {
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

    const projectCounts: Record<string, number> = {};

    rows.forEach((row) => {
      const project = row["projectName"] || "未設定";
      projectCounts[project] = (projectCounts[project] ?? 0) + 1;
    });

    return NextResponse.json({
      fileName: latestFile,
      totalCount: rows.length,
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
