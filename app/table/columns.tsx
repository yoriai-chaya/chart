"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Issue } from "./types";

const longTextCell = (value: string) => (
  <div className="max-h-24 max-w-md overflow-y-auto whitespace-pre-wrap wrap-break-words">
    {value}
  </div>
);

export const columns: ColumnDef<Issue>[] = [
  {
    accessorKey: "issueID",
    header: "Issue ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "createdAt",
    header: "Issue Date",
  },
  {
    accessorKey: "team",
    header: "Team",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => longTextCell(row.original.description),
  },
  {
    accessorKey: "resolutionStatus",
    header: "Resolution",
    cell: ({ row }) => longTextCell(row.original.resolutionStatus),
  },
  {
    accessorKey: "completedAt",
    header: "Completed At",
  },
];
