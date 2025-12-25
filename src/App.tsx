import { usePomodoro } from "./hooks/usePomodoro";
import TimerDisplay from "./components/Timer/TimerDisplay";
import WeeklyView from "./components/Stats/WeeklyView";
import Heatmap from "./components/Stats/Heatmap";
import BasicStats from "./components/Stats/BasicStats";
import { ThemeProvider } from "./context/ThemeContext";
import { PomodoroProvider } from "./context/PomodoroContext";
import ThemeToggle from "./components/ThemeToggle";
import { Timer } from "lucide-react";

function AppContent() {
    const {
        mode,
        timeLeft,
        isActive,
        toggleTimer,
        resetTimer,
        skipTimer,
        history,
        settings,
    } = usePomodoro();

    let totalTime = settings.focusDuration * 60;
    if (mode === "shortBreak") totalTime = settings.shortBreakDuration * 60;
    if (mode === "longBreak") totalTime = settings.longBreakDuration * 60;

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <header className="container mx-auto p-4 max-w-4xl flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Timer className="w-6 h-6" />
                    <span>Pomodoro</span>
                </div>
                <ThemeToggle />
            </header>

            <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl space-y-12">
                <section className="flex flex-col items-center justify-center min-h-[50vh]">
                    <TimerDisplay
                        mode={mode}
                        timeLeft={timeLeft}
                        isActive={isActive}
                        totalTime={totalTime}
                        onToggle={toggleTimer}
                        onReset={resetTimer}
                        onSkip={skipTimer}
                    />
                </section>

                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="p-4 rounded-xl border shadow-sm justify-center">
                        <BasicStats history={history} />
                    </div>

                    <div className="p-4 rounded-xl border shadow-sm">
                        <WeeklyView history={history} />
                    </div>

                    <div className="p-4 rounded-xl border shadow-sm overflow-hidden">
                        <Heatmap history={history} />
                    </div>
                </section>
            </main>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="pomodoro-theme">
            <PomodoroProvider>
                <AppContent />
            </PomodoroProvider>
        </ThemeProvider>
    );
}

export default App;
