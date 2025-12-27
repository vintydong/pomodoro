import { SettingsIcon, XIcon } from "lucide-react";
import { usePomodoro } from "../context/PomodoroContext";
import { useState } from "react";
import type { TimerSettings } from "../types";

interface SettingsProps {
    onOpen: () => void;
}

export function Settings({ onOpen }: SettingsProps) {
    return (
        <button className="cursor-pointer" onClick={onOpen}>
            <SettingsIcon size={24} />
        </button>
    );
}

interface SettingsToggleProps {
    id: string;
    label?: string;
    enabled: boolean;
    onChange: (value: any) => void;
}

const SettingsToggle = ({
    id,
    label,
    enabled,
    onChange,
}: SettingsToggleProps) => {
    return (
        <div className="flex flex-row justify-between gap-2">
            {label && <div className="text-xs opacity-50">{label}</div>}
            <label
                htmlFor={id}
                className="relative inline-block w-11 h-6 cursor-pointer"
            >
                <input
                    type="checkbox"
                    id={id}
                    className="peer sr-only"
                    checked={enabled}
                    onChange={onChange}
                />
                <span className="absolute inset-0 rounded-full transition-colors duration-200 ease-in-out bg-tertiary/25 peer-disabled:pointer-events-none"></span>
                <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 rounded-full shadow-xs transition-transform duration-200 ease-in-out bg-tertiary/25 peer-checked:bg-accent peer-checked:translate-x-full"></span>
            </label>
        </div>
    );
};

interface SettingsInputProps {
    label: string;
    value: any;
    onChange: (value: any) => void;
}

const SettingsInput = ({ label, value, onChange }: SettingsInputProps) => {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="text-xs opacity-50">{label}</div>
            <input
                value={value}
                className="rounded-2xl p-2 w-20 text-center bg-tertiary/25 focus:outline-tertiary focus:outline-2"
                onChange={onChange}
            />
        </div>
    );
};

interface SettingsModalProps {
    setIsSettingsOpen: (open: boolean) => void;
}

export function SettingsModal({ setIsSettingsOpen }: SettingsModalProps) {
    const { settings, updateSettings } = usePomodoro();
    const [focusTime, setFocusTime] = useState(settings.focusDuration);
    const [shortBreakTime, setShortBreakTime] = useState(
        settings.shortBreakDuration
    );
    const [longBreakTime, setLongBreakTime] = useState(
        settings.longBreakDuration
    );

    const [autoFocus, setAutoFocus] = useState(settings.autoFocus);
    const [autoBreak, setAutoBreak] = useState(settings.autoBreak);

    const onClose = () => {
        const focusDuration = Number(focusTime);
        const shortBreakDuration = Number(shortBreakTime);
        const longBreakDuration = Number(longBreakTime);

        const partialSettings: Partial<TimerSettings> = {
            autoFocus,
            autoBreak,
        };

        console.log(
            "Updating with",
            focusDuration,
            shortBreakDuration,
            longBreakDuration
        );

        if (!Number.isNaN(focusDuration) && focusDuration > 0) {
            partialSettings.focusDuration = focusDuration;
        }

        if (!Number.isNaN(shortBreakDuration) && shortBreakDuration > 0) {
            partialSettings.shortBreakDuration = shortBreakDuration;
        }

        if (!Number.isNaN(longBreakDuration) && longBreakDuration > 0) {
            partialSettings.longBreakDuration = longBreakDuration;
        }

        updateSettings(partialSettings);
        setIsSettingsOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative bg-background p-6 rounded-xl shadow-lg w-full max-w-xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-md font-semibold uppercase font-mono">
                        Timer Settings
                    </h2>
                    <button className="cursor-pointer" onClick={onClose}>
                        <XIcon size={24} />
                    </button>
                </div>
                <div className="flex items-center gap-4 mx-auto">
                    <SettingsInput
                        label="Focus Time (min)"
                        value={focusTime}
                        onChange={(e) => setFocusTime(e.target.value)}
                    />
                    <SettingsInput
                        label="Short Break Time (min)"
                        value={shortBreakTime}
                        onChange={(e) => setShortBreakTime(e.target.value)}
                    />
                    <SettingsInput
                        label="Long Break Time (min)"
                        value={longBreakTime}
                        onChange={(e) => setLongBreakTime(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-4 mx-auto">
                    <SettingsToggle
                        id="autoFocus"
                        label="Auto Start Focus Timer"
                        enabled={autoFocus}
                        onChange={(e) => setAutoFocus(e.target.checked)}
                    />
                    <SettingsToggle
                        id="autoBreak"
                        label="Auto Start Break Timer"
                        enabled={autoBreak}
                        onChange={(e) => setAutoBreak(e.target.checked)}
                    />
                </div>
            </div>
        </div>
    );
}
