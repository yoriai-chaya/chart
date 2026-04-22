"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Issue } from "./types";
import { COLUMN_LABEL } from "../app-config";

const longTextCell = (value: string) => (
  <div className="max-h-24 max-w-md overflow-y-auto whitespace-pre-wrap wrap-break-words">
    {value}
  </div>
);

export const columns: ColumnDef<Issue>[] = [
  {
    accessorKey: "issueID",
    header: COLUMN_LABEL.issueID,
  },
  {
    accessorKey: "title",
    header: COLUMN_LABEL.title,
  },
  {
    accessorKey: "createdAt",
    header: COLUMN_LABEL.createdAt,
  },
  {
    accessorKey: "team",
    header: COLUMN_LABEL.team,
  },
  {
    accessorKey: "category",
    header: COLUMN_LABEL.category,
  },
  {
    accessorKey: "status",
    header: COLUMN_LABEL.status,
  },
  {
    accessorKey: "description",
    header: COLUMN_LABEL.description,
    cell: ({ row }) => longTextCell(row.original.description),
  },
  {
    accessorKey: "resolutionStatus",
    header: COLUMN_LABEL.resolutionStatus,
    cell: ({ row }) => longTextCell(row.original.resolutionStatus),
  },
  {
    accessorKey: "completedAt",
    header: COLUMN_LABEL.completedAt,
  },
];
