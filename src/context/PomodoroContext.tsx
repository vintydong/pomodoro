import {
    createContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
    useContext,
} from "react";
import type { TimerMode, TimerSettings, SessionLog } from "../types";
import { DEFAULT_SETTINGS } from "../types";
import { formatTime } from "../utils/format";

// Audio asset paths (replace with your actual sound files)
const FOCUS_END_SOUND = "/focus.mp3";
const BREAK_END_SOUND = "/break.mp3";

const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch((error) => {
        console.error("Error playing audio:", error);
    });
};

interface PomodoroContextType {
    mode: TimerMode;
    timeLeft: number;
    isActive: boolean;
    sessionsCompleted: number;
    history: SessionLog[];
    settings: TimerSettings;
    toggleTimer: () => void;
    resetTimer: () => void;
    skipTimer: () => void;
    deleteData: () => void;
    importData: (data: SessionLog[]) => void;
    setMode: (mode: TimerMode) => void;
    updateSettings: (settings: Partial<TimerSettings>) => void;
}

export const PomodoroContext = createContext<PomodoroContextType | undefined>(
    undefined
);

export const PomodoroProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<TimerMode>("focus");
    const [timeLeft, setTimeLeft] = useState(
        DEFAULT_SETTINGS.focusDuration * 60
    );
    const [isActive, setIsActive] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [settings, _setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);

    // Persist sessions in localStorage
    const [history, setHistory] = useState<SessionLog[]>(() => {
        const saved = localStorage.getItem("pomodoro-history");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("pomodoro-history", JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem("pomodoro-settings", JSON.stringify(settings));
        resetTimer();
    }, [settings]);

    const switchMode = useCallback(
        (newMode: TimerMode) => {
            setMode(newMode);
            switch (newMode) {
                case "focus":
                    setTimeLeft(settings.focusDuration * 60);
                    break;
                case "shortBreak":
                    setTimeLeft(settings.shortBreakDuration * 60);
                    break;
                case "longBreak":
                    setTimeLeft(settings.longBreakDuration * 60);
                    break;
            }
            setIsActive(false);
        },
        [settings]
    );

    const handleTimerComplete = useCallback(
        (elapsedOverride?: number) => {
            setIsActive(false);

            // Log session if it was a focus session and >= 1min
            if (mode === "focus") {
                const duration =
                    elapsedOverride !== undefined
                        ? elapsedOverride
                        : settings.focusDuration * 60;
                const newCompleted = sessionsCompleted + 1;

                if (duration > 0) {
                    const newSession: SessionLog = {
                        id: crypto.randomUUID(),
                        startTime: new Date().toISOString(),
                        duration: duration,
                        mode: "focus",
                        completed: true,
                    };
                    setHistory((prev) => [...prev, newSession]);

                    setSessionsCompleted(newCompleted);
                }

                if (newCompleted % settings.longBreakInterval === 0) {
                    switchMode("longBreak");
                } else {
                    switchMode("shortBreak");
                }
            } else {
                switchMode("focus");
            }

            // Play notification sound
            if (mode === "focus") {
                playSound(FOCUS_END_SOUND);
            } else {
                playSound(BREAK_END_SOUND);
            }
        },
        [mode, sessionsCompleted, settings, switchMode]
    );

    useEffect(() => {
        let interval: number | undefined;

        if (isActive && timeLeft > 0) {
            interval = window.setInterval(() => {
                document.title = `Pomodoro - ${formatTime(timeLeft - 1)}`;
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            handleTimerComplete();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, handleTimerComplete]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        switch (mode) {
            case "focus":
                setTimeLeft(settings.focusDuration * 60);
                break;
            case "shortBreak":
                setTimeLeft(settings.shortBreakDuration * 60);
                break;
            case "longBreak":
                setTimeLeft(settings.longBreakDuration * 60);
                break;
        }
    };

    const skipTimer = () => {
        let totalTime = settings.focusDuration * 60;
        if (mode === "shortBreak") totalTime = settings.shortBreakDuration * 60;
        if (mode === "longBreak") totalTime = settings.longBreakDuration * 60;

        const elapsed = totalTime - timeLeft;
        handleTimerComplete(elapsed);
    };

    const deleteData = () => {
        localStorage.removeItem("pomodoro-history");
        setHistory([]);
    };

    const importData = (data: SessionLog[]) => {
        localStorage.setItem("pomodoro-history", JSON.stringify(data));
        setHistory(data);
    };

    const updateSettings = (newSettings: Partial<TimerSettings>) => {
        _setSettings((oldSettings) => ({ ...oldSettings, ...newSettings }));
    };

    return (
        <PomodoroContext.Provider
            value={{
                mode,
                timeLeft,
                isActive,
                sessionsCompleted,
                history,
                settings,
                toggleTimer,
                resetTimer,
                skipTimer,
                deleteData,
                importData,
                setMode,
                updateSettings,
            }}
        >
            {children}
        </PomodoroContext.Provider>
    );
};

export const usePomodoro = () => {
    const context = useContext(PomodoroContext);
    if (context === undefined) {
        throw new Error("usePomodoro must be used within a PomodoroProvider");
    }
    return context;
};
