import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { SessionLog } from '../../types';
import { useMemo } from 'react';
import { startOfWeek, addDays, format, parseISO, isSameDay } from 'date-fns';

interface WeeklyViewProps {
    history: SessionLog[];
}

export function WeeklyView({ history }: WeeklyViewProps) {
    const data = useMemo(() => {
        const today = new Date();
        const start = startOfWeek(today, { weekStartsOn: 0 });
        const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

        return days.map(day => {
            const dayStr = format(day, 'EEE');

            // Sum duration for this day
            const daySeconds = history.reduce((acc, session) => {
                if (!session.completed || session.mode !== 'focus') return acc;
                const sessionDate = parseISO(session.startTime);
                if (isSameDay(sessionDate, day)) {
                    return acc + session.duration;
                }
                return acc;
            }, 0);

            return {
                name: dayStr,
                hours: Math.round((daySeconds / 3600) * 100) / 100
            };
        });
    }, [history]);

    return (
        <div className="w-full h-64">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Initial Weekly Progress</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis
                        dataKey="name"
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}h`}
                    />
                    <Tooltip
                        cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--card-foreground)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill="var(--primary)" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
