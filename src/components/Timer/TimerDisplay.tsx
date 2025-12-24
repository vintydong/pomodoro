import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import type { TimerMode } from "../../types";
import { formatTime } from "../../utils/format";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface TimerDisplayProps {
    timeLeft: number;
    isActive: boolean;
    mode: TimerMode;
    totalTime: number; // For progress calculation
    onToggle: () => void;
    onReset: () => void;
    onSkip: () => void;
}

interface TimerButtonProps {
    onClick: () => void;
    ariaLabel: string;
    children: React.ReactNode;
}

const MODE_LABELS: Record<TimerMode, string> = {
    focus: "Focus Time!",
    shortBreak: "Short Break",
    longBreak: "Long Break",
};

const TimerButton = ({ onClick, ariaLabel, children }: TimerButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="p-4 rounded-full text-tertiary hover:opacity-90 transition-opacity disabled:opacity-50"
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
};

export function TimerDisplay({
    timeLeft,
    isActive,
    mode,
    totalTime,
    onToggle,
    onReset,
    onSkip,
}: TimerDisplayProps) {
    const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            <div className="text-xl font-medium text-foreground uppercase">
                {MODE_LABELS[mode]}
            </div>

            <div className="relative flex items-center justify-center w-72 h-72">
                <CircularProgressbar
                    value={progress}
                    strokeWidth={4}
                    text={formatTime(timeLeft)}
                    styles={buildStyles({
                        pathColor: "var(--color-tertiary)",
                        textColor: "var(--foreground)",
                        trailColor: "var(--background)",
                    })}
                />
            </div>

            <div className="flex items-center gap-4">
                <TimerButton
                    onClick={onToggle}
                    ariaLabel={isActive ? "Pause" : "Start"}
                >
                    {isActive ? (
                        <Pause className="w-8 h-8" />
                    ) : (
                        <Play className="w-8 h-8" />
                    )}
                </TimerButton>

                <TimerButton onClick={onSkip} ariaLabel="Skip">
                    <SkipForward className="w-8 h-8" />
                </TimerButton>

                <TimerButton onClick={onReset} ariaLabel="Reset">
                    <RotateCcw className="w-8 h-8" />
                </TimerButton>
            </div>
        </div>
    );
}
