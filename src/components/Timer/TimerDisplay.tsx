import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import type { TimerMode } from "../../types";
import { formatTime } from "../../utils/format";

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
            className="p-4 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
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
    const progress =
        totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            <div className="text-xl font-medium tracking-wide text-muted-foreground uppercase">
                {MODE_LABELS[mode]}
            </div>

            <div className="relative flex items-center justify-center">
                {/* Progress Ring */}
                <svg className="transform -rotate-90 w-72 h-72">
                    <circle
                        cx="144"
                        cy="144"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted/20"
                    />
                    <circle
                        cx="144"
                        cy="144"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="text-primary transition-all duration-1000 ease-in-out"
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-bold tracking-tighter tabular-nums text-foreground">
                        {formatTime(timeLeft)}
                    </span>
                </div>
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
