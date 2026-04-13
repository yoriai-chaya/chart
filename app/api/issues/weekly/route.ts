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
  projectName: string;
  status: string;
  description: string;
  resolutionStatus: string;
  completedAt: string;
};

type WeeklyIssueSummary = {
  date: string;
  total: number;
  newIssue: number;
  inProgress: number;
  completed: number;
};

const IN_PROGRESS_STATUSES = new Set([
  "調査中",
  "保留",
  "修正中/対応中",
  "確認中/検証中",
]);

export async function GET() {
  try {
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

      let newIssue = 0;
      let inProgress = 0;
      let completed = 0;

      rows.forEach((row) => {
        const status = row.status?.trim();

        if (status === "新規/未着手") {
          newIssue++;
        } else if (IN_PROGRESS_STATUSES.has(status)) {
          inProgress++;
        } else if (status === "完了") {
          completed++;
        }
      });

      const date = `${file.slice(0, 4)}/${file.slice(4, 6)}/${file.slice(6, 8)}`;

      result.push({
        date,
        total: rows.length,
        newIssue,
        inProgress,
        completed,
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
