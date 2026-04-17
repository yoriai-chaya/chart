import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";

export async function GET() {
  try {
    const csvDir = path.join(process.cwd(), "public", "csv");
    const files = await fs.readdir(csvDir);

    const csvFiles = files.filter((file) => /^\d{8}\.csv$/.test(file)).sort();

    const latestFile = csvFiles[csvFiles.length - 1];

    if (!latestFile) {
      return NextResponse.json([], { status: 200 });
    }

    const filePath = path.join(csvDir, latestFile);
    const csvText = await fs.readFile(filePath, "utf-8");

    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "CSV取得に失敗しました" },
      { status: 500 },
    );
  }
}
