import { DonutChart } from "./components/donut-chart";
import { Summary } from "./components/summary";
import { IssuesLineChart } from "./components/line-chart";

const DashboardPage = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        <div className="flex h-full mx-auto w-full sm:col-span-1">
          <DonutChart />
        </div>
        <div className="sm:col-span-1">
          <Summary />
        </div>
      </div>
      <IssuesLineChart />
    </div>
  );
};
export default DashboardPage;
