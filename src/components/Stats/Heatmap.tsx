import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import type { SessionLog } from '../../types';
import { useMemo } from 'react';
import { subDays, format, parseISO } from 'date-fns';

interface HeatmapProps {
    history: SessionLog[];
}

export function Heatmap({ history }: HeatmapProps) {
    const values = useMemo(() => {
        // Group history by date
        const dailyCounts: Record<string, number> = {};

        history.forEach(session => {
            if (!session.completed || session.mode !== 'focus') return;

            const dateStr = format(parseISO(session.startTime), 'yyyy-MM-dd');
            dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + (session.duration / 3600); // Hours
        });

        return Object.entries(dailyCounts).map(([date, count]) => ({
            date,
            count: Math.round(count * 10) / 10 // Round to 1 decimal
        }));
    }, [history]);

    const today = new Date();

    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Monthly Activity</h3>
            <div className="heatmap-container">
                <CalendarHeatmap
                    startDate={subDays(today, 100)} // Last 100 days
                    endDate={today}
                    values={values}
                    classForValue={(value) => {
                        if (!value) {
                            return 'color-empty';
                        }
                        // Assuming max ~8 hours
                        if (value.count < 1) return 'color-scale-1';
                        if (value.count < 3) return 'color-scale-2';
                        if (value.count < 5) return 'color-scale-3';
                        return 'color-scale-4';
                    }}
                    tooltipDataAttrs={(value: any) => {
                        return {
                            'data-tip': value?.date ? `${value.date}: ${value.count} hrs` : 'No data',
                        } as any;
                    }}
                    showWeekdayLabels
                    showOutOfRangeDays
                />
            </div>
        </div>
    );
}
