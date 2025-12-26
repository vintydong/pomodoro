import { parseISO, format, isToday, differenceInCalendarDays } from "date-fns";
import type { SessionLog } from "../../types";
import { formatTime } from "../../utils/format";
import { ChartColumn, Download, Trash2, Upload } from "lucide-react";
import { usePomodoro } from "../../context/PomodoroContext";

interface BasicStatsProps {
    history: SessionLog[];
}

interface ButtonProps {
    onClick: () => void;
    ariaLabel: string;
    children: React.ReactNode;
}

const Button = ({ onClick, ariaLabel, children }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="rounded-full cursor-pointer transition-all disabled:opacity-50"
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
};

const DeleteButton = () => {
    const { deleteData } = usePomodoro();

    return (
        <Button onClick={deleteData} ariaLabel="Delete all data">
            <Trash2 size={24} />
        </Button>
    );
};

const DownloadButton = () => {
    const { history } = usePomodoro();

    const downloadData = () => {
        const data = JSON.stringify(history, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "pomodoro_history.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Button onClick={downloadData} ariaLabel="Download data">
            <Download size={24} />
        </Button>
    );
};

const UploadButton = () => {
    const { importData } = usePomodoro();

    const uploadData = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.addEventListener("change", (e: Event) => {
            const file = (e.target as HTMLInputElement)?.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = JSON.parse(e.target?.result as string);
                console.log("Uploaded", data);
                importData(data);
            };
            reader.readAsText(file);
        });
        input.click();
    };

    return (
        <Button onClick={uploadData} ariaLabel="Upload data">
            <Upload size={24} />
        </Button>
    );
};

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
            <div className="flex mb-4 justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 uppercase font-mono">
                    Stats <ChartColumn size={24} />
                </h3>
                <span className="text-xs opacity-50 flex gap-2">
                    <DeleteButton />
                    <DownloadButton />
                    <UploadButton />
                </span>
            </div>
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
