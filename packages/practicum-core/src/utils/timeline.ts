import { TimelineConfig, TimelineEvent, TimelineWeek } from '../types/timeline';
import { v4 as uuidv4 } from 'uuid';

export const generateTimeline = (
    startDate: string,
    endDate: string,
    logInterval: 'daily' | 'weekly' | 'biweekly' = 'weekly',
    cohortTitle: string
): TimelineConfig => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const weeks: TimelineWeek[] = [];
    const events: TimelineEvent[] = [];

    // 1. Generate Weeks
    let current = new Date(start);
    let weekCount = 1;

    while (current < end) {
        const weekStart = new Date(current);
        const weekEnd = new Date(current);
        weekEnd.setDate(weekEnd.getDate() + 6); // 7 day weeks

        // Clamp weekEnd to not exceed practicum end date logic? 
        // Usually weeks are fixed 7-day cycles for reporting

        weeks.push({
            week_number: weekCount,
            start_date: weekStart.toISOString(),
            end_date: weekEnd.toISOString(),
            label: `Week ${weekCount}`
        });

        current.setDate(current.getDate() + 7);
        weekCount++;
    }

    // 2. Default Events

    // Start Date
    events.push({
        id: uuidv4(),
        title: 'Reporting Date',
        date: startDate,
        type: 'milestone',
        description: 'First day of practicum placement',
        is_system: true
    });

    // End Date
    events.push({
        id: uuidv4(),
        title: 'Practicum Ends',
        date: endDate,
        type: 'milestone',
        description: 'Last day of practicum placement',
        is_system: true
    });

    // Log Submissions (Every Friday by default)
    if (logInterval === 'weekly') {
        weeks.forEach(week => {
            const deadline = new Date(week.start_date);
            // Calculate Friday (assuming start_date might not be Monday)
            // But usually "Log Due" is relative to the week. 
            // Let's set it to the END of the week (week.end_date)

            // Check if deadline is after end date match
            if (new Date(week.end_date) > end) return;

            events.push({
                id: uuidv4(),
                title: `Week ${week.week_number} Log Due`,
                date: week.end_date, // End of the week cycle
                type: 'log',
                description: `Log submission for Week ${week.week_number}`,
                is_system: true
            });
        });
    }

    // Supervisor Report (End + 7 days)
    const supervisorDate = new Date(end);
    supervisorDate.setDate(supervisorDate.getDate() + 7);
    events.push({
        id: uuidv4(),
        title: 'Supervisor Report Due',
        date: supervisorDate.toISOString(),
        type: 'report',
        description: 'Deadline for supervisor verification and assessment',
        is_system: true
    });

    // Student Final Report (End + 30 days)
    const reportDate = new Date(end);
    reportDate.setDate(reportDate.getDate() + 30);
    events.push({
        id: uuidv4(),
        title: 'Final Student Report Due',
        date: reportDate.toISOString(),
        type: 'report',
        description: 'Deadline for final academic report submission',
        is_system: true
    });

    return {
        weeks,
        events,
        settings: {
            log_deadline_day: 5,
            report_offset_days: 30,
            supervisor_offset_days: 7
        }
    };
};
