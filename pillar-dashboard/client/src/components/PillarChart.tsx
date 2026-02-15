import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardData } from '@/lib/types';

interface PillarChartProps {
  data: DashboardData;
}

export default function PillarChart({ data }: PillarChartProps) {
  const chartData = data.pillars.map(pillar => {
    const sheet = data.data[pillar.id];
    const listCount = sheet?.lists.length || 0;
    const rowCount = sheet?.lists.reduce((acc, list) => acc + (list.data?.length || 0), 0) || 0;
    // Use a short name for chart display
    const shortName = pillar.name.length > 8
      ? pillar.name.slice(0, 8).trim() + '...'
      : pillar.name;
    return {
      name: shortName,
      icon: pillar.icon,
      lists: listCount,
      rows: rowCount,
      color: pillar.color,
    };
  });

  const hasData = chartData.some(d => d.lists > 0 || d.rows > 0);
  if (!hasData) return null;

  return (
    <div className="px-4 py-3 border-t border-border">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Overview</p>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="icon"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              fontSize: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--popover)',
              color: 'var(--popover-foreground)',
            }}
            formatter={(value: number, name: string) => [value, name === 'lists' ? 'Lists' : 'Rows']}
            labelFormatter={(_, payload) => {
              if (payload && payload.length > 0) {
                const item = payload[0].payload;
                return `${item.icon} ${item.name}`;
              }
              return '';
            }}
          />
          <Bar dataKey="lists" fill="var(--primary)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
