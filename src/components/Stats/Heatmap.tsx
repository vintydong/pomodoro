import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import type { SessionLog } from "../../types";
import { useMemo } from "react";
import { subDays, format, parseISO } from "date-fns";
import { Activity } from "lucide-react";
import { Tooltip } from "react-tooltip";

interface HeatmapProps {
    history: SessionLog[];
}

export default function Heatmap({ history }: HeatmapProps) {
    const values = useMemo(() => {
        // Group history by date
        const dailyCounts: Record<string, number> = {};

        history.forEach((session) => {
            if (!session.completed || session.mode !== "focus") return;

            const dateStr = format(parseISO(session.startTime), "yyyy-MM-dd");
            dailyCounts[dateStr] =
                (dailyCounts[dateStr] || 0) + session.duration / 3600; // Hours
        });

        return Object.entries(dailyCounts).map(([date, count]) => ({
            date,
            count: Math.round(count * 10) / 10, // Round to 1 decimal
        }));
    }, [history]);

    const today = new Date();

    return (
        <div className="w-full">
            <div className="flex mb-4 justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 uppercase font-mono">
                    Your Activity - last 100 days <Activity size={24} />
                </h3>
                <div className="text-xs flex items-center">
                    <span className="mr-2 opacity-50">Less</span>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span
                            key={i}
                            className={`w-4 h-4 inline-block bg-tertiary color-scale-${i}`}
                        />
                    ))}
                    <span className="ml-2 opacity-50">More</span>
                </div>
            </div>

            <div className="heatmap-container">
                <CalendarHeatmap
                    startDate={subDays(today, 100)}
                    endDate={today}
                    values={values}
                    classForValue={(value) => {
                        if (!value) {
                            return "color color-scale-0";
                        }
                        if (value.count < 1) return "color color-scale-1";
                        if (value.count < 3) return "color color-scale-2";
                        if (value.count < 5) return "color color-scale-3";
                        return "color color-scale-4";
                    }}
                    tooltipDataAttrs={(value: any) => {
                        return {
                            "data-tooltip-content": value?.date
                                ? `${value.date} - ${value.count} hrs`
                                : "",
                            "data-tooltip-id": "heatmap-tooltip",
                        } as any;
                    }}
                    showOutOfRangeDays
                    gutterSize={0.75}
                />
                <Tooltip id="heatmap-tooltip" />
            </div>
        </div>
    );
}
