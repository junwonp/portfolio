import * as shared from './adminShared.css';
import type { DailyChartEntry } from './trendChartGeometry';

interface TrafficDataTableProps {
  dailyChart: DailyChartEntry[];
  rangeLabel: string;
}

export function TrafficDataTable({ dailyChart, rangeLabel }: TrafficDataTableProps) {
  return (
    <div className={shared.srOnly}>
      <table>
        <caption>{`${rangeLabel} 트래픽 데이터`}</caption>
        <thead>
          <tr>
            <th scope="col">날짜</th>
            <th scope="col">세션 수</th>
            <th scope="col">조회 수</th>
          </tr>
        </thead>
        <tbody>
          {dailyChart.map((day) => (
            <tr key={day.date}>
              <th scope="row">{day.date}</th>
              <td>{day.sessions}</td>
              <td>{day.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
