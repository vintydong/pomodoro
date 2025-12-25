import { startOfWeek, addDays, format, isSameDay, parseISO } from "date-fns";
import type { SessionLog } from "../../types";
import { CalendarDays } from "lucide-react";
import { Tooltip } from "react-tooltip";

interface WeeklyViewProps {
    history: SessionLog[];
}

const Header = ({ weekDates }: { weekDates: Date[] }) => {
    const today = new Date();
    return (
        <div className="sticky top-0 z-20 bg-background flex border-b">
            <div className="w-12 border-r" />
            {weekDates.map((date) => (
                <div
                    key={date.toISOString()}
                    className={`flex-1 py-2 text-center border-r text-xs ${
                        isSameDay(date, today) ? "bg-accent/30" : ""
                    }`}
                >
                    <div className="text-xs uppercase opacity-50 font-medium">
                        {format(date, "EEE")}
                    </div>
                    <div className="text-xs font-bold">{format(date, "d")}</div>
                </div>
            ))}
        </div>
    );
};

const TimeGutter = ({ hours }: { hours: number[] }) => {
    return (
        <div className="w-12 border-r left-0">
            {hours.map((hour) => (
                <div
                    key={hour}
                    className="h-[60px] text-sm text-right pr-2 flex flex-col justify-center opacity-40 font-mono"
                >
                    {hour}:00
                </div>
            ))}
        </div>
    );
};

const DayColumns = ({
    weekDates,
    weekSessions,
    getSessionStyle,
}: {
    weekDates: Date[];
    weekSessions: SessionLog[];
    getSessionStyle: (session: SessionLog) => { top: string; height: string };
}) => {
    const sessionToComponent = (session: SessionLog) => {
        const startTime = format(parseISO(session.startTime), "HH:mm");
        const durationMins = Math.floor(session.duration / 60);
        const tooltipContent = `${startTime} - ${durationMins} min${
            durationMins === 1 ? "" : "s"
        }`;

        if (durationMins <= 0) return <></>;

        return (
            <div
                key={session.id}
                className="absolute left-1 right-1 rounded bg-tertiary/20 border border-tertiary/30 px-2 overflow-hidden text-xs/6 leading-4 hover:bg-tertiary/30 transition-colors"
                style={getSessionStyle(session)}
                data-tooltip-id="weekly-tooltip"
                data-tooltip-content={tooltipContent}
            />
        );
    };

    return (
        <>
            {weekDates.map((date) => (
                <div
                    key={date.toISOString()}
                    className="flex-1 border-r relative group"
                >
                    {weekSessions
                        .filter((s) => isSameDay(parseISO(s.startTime), date))
                        .map(sessionToComponent)}
                </div>
            ))}
        </>
    );
};

export default function WeeklyView({ history }: WeeklyViewProps) {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 });
    const endofWeek = addDays(startOfCurrentWeek, 7);

    const weekDates = Array.from({ length: 7 }, (_, i) =>
        addDays(startOfCurrentWeek, i)
    );

    const hours = Array.from({ length: 24 }, (_, i) => i);

    const weekSessions = history.filter((session) => {
        if (!session.completed || session.mode !== "focus") return false;
        const sessionDate = parseISO(session.startTime);
        return sessionDate >= startOfCurrentWeek && sessionDate < endofWeek;
    });

    const getSessionStyle = (session: SessionLog) => {
        const date = parseISO(session.startTime);
        const minutesFromStartOfDay = date.getHours() * 60 + date.getMinutes();
        const durationInMinutes = session.duration / 60;

        // Grid height is roughly 24 hours * 60px per hour = 960px
        // Min height of 25px
        const hourHeight = 60;
        const top = (minutesFromStartOfDay / 60) * hourHeight;
        const height = Math.max((durationInMinutes / 60) * hourHeight, 15);

        return {
            top: `${top}px`,
            height: `${height}px`,
        };
    };

    return (
        <div className="flex flex-col h-[600px] w-full rounded-lg overflow-hidden">
            <div className="flex mb-4 justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 uppercase font-mono">
                    Your sessions in the last week <CalendarDays size={24} />
                </h3>
                <span className="text-xs opacity-50">
                    {format(weekDates[0], "MMM d")} -{" "}
                    {format(weekDates[6], "MMM d, yyyy")}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto relative pr-2">
                <Header weekDates={weekDates} />

                <div className="flex relative min-h-[960px]">
                    <TimeGutter hours={hours} />

                    <div className="flex flex-1 relative">
                        <div className="absolute inset-0 pointer-events-none">
                            {hours.map((hour) => (
                                <div
                                    key={hour}
                                    className="h-[60px] border-b border-foreground/20"
                                />
                            ))}
                        </div>

                        <DayColumns
                            weekDates={weekDates}
                            weekSessions={weekSessions}
                            getSessionStyle={getSessionStyle}
                        />
                        <Tooltip id="weekly-tooltip" />
                    </div>
                </div>
            </div>
        </div>
    );
}
