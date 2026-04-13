import { DonutChart } from "./components/donut-chart";
import { Summary } from "./components/summary";
import { IssuesLineChart } from "./components/line-chart";

const DashboardPage = () => {
  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-3">
        <div className="mx-auto w-full max-w-80 sm:col-span-1">
          <DonutChart />
        </div>
        <div className="sm:col-span-2">
          <Summary />
        </div>
      </div>
      <IssuesLineChart />
    </div>
  );
};
export default DashboardPage;

