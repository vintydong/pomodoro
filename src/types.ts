export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface SessionLog {
    id: string;
    startTime: string;
    duration: number; // in seconds
    mode: TimerMode;
    completed: boolean;
}

export interface TimerSettings {
    focusDuration: number; // in minutes
    shortBreakDuration: number;
    longBreakDuration: number;
    longBreakInterval: number;
}

export const DEFAULT_SETTINGS: TimerSettings = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
};
