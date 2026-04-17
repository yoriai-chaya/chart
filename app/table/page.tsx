import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Issue } from "./types";

async function getIssues(): Promise<Issue[]> {
  const res = await fetch("http://localhost:3000/api/issue-list", {
    cache: "no-store",
  });

  return res.json();
}

export default async function TablePage() {
  const data = await getIssues();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
