import { parseISO, format, isToday, differenceInCalendarDays } from "date-fns";
import type { SessionLog } from "../../types";
import { formatTime } from "../../utils/format";
import { ChartColumn } from "lucide-react";

interface BasicStatsProps {
    history: SessionLog[];
}

export default function BasicStats({ history }: BasicStatsProps) {
    const focusSessions = history.filter(
        (s) => s.completed && s.mode === "focus"
    );

    const focusSessionsToday = focusSessions.filter((s) =>
        isToday(parseISO(s.startTime))
    );

    const getStreak = () => {
        const uniqueDates = Array.from(
            new Set(
                focusSessions.map((s) =>
                    format(parseISO(s.startTime), "yyyy-MM-dd")
                )
            )
        ).sort((a, b) => b.localeCompare(a));

        if (uniqueDates.length === 0) return 0;

        const latestDate = parseISO(uniqueDates[0]);
        const dayDiffFromToday = differenceInCalendarDays(
            new Date(),
            latestDate
        );

        if (dayDiffFromToday > 1) return 0;

        let streak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
            const current = parseISO(uniqueDates[i]);
            const next = parseISO(uniqueDates[i + 1]);

            if (differenceInCalendarDays(current, next) === 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    const currentStreak = getStreak();

    const stats = [
        {
            label: "Sessions Today 📅",
            value: focusSessionsToday.length,
        },
        {
            label: "Focus Time Today 🕒",
            value: formatTime(
                focusSessionsToday.reduce((acc, s) => acc + s.duration, 0)
            ),
        },
        {
            label: "Daily Streak 🔥",
            value: `${currentStreak} day${currentStreak === 1 ? "" : "s"}`,
        },
    ];

    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2 uppercase font-mono">
                Stats <ChartColumn size={24} />
            </h3>
            <div className="flex flex-row items-center justify-around">
                {stats.map(({ label, value }) => (
                    <div
                        key={label}
                        className="flex flex-col items-center justify-center mx-4"
                    >
                        <div className="opacity-75">{label}</div>
                        <div className="text-2xl font-bold">{value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
