"use client";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Issue } from "./types";
import { useTeamFilterQuery } from "../useTeamFilterQuery";

export default function TablePage() {
  const [data, setData] = useState<Issue[]>([]);
  const query = useTeamFilterQuery();

  useEffect(() => {
    const fetchIssues = async () => {
      const res = await fetch(`/api/issue-list${query}`);
      const json = await res.json();
      setData(json);
    };
    fetchIssues();
  }, [query]);

  return (
    <div className="container mx-auto p-4">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
