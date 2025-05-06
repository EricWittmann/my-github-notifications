import {DateTime} from "luxon";

export function today(): DateTime {
    return DateTime.local().startOf("day").toUTC();
}

export function last24Hours(): DateTime {
    return DateTime.local().minus({ hours: 24 }).toUTC();
}

export function thisWeek(): DateTime {
    return DateTime.local().startOf("week").toUTC();
}

export function last7Days(): DateTime {
    return DateTime.local().minus({ days: 7 }).toUTC();
}

export function last14Days(): DateTime {
    return DateTime.local().minus({ days: 14 }).toUTC();
}

export function toDateTime(range: string): DateTime {
    switch (range) {
        case "today":
            return today();
        case "last24Hours":
            return last24Hours();
        case "thisWeek":
            return thisWeek();
        case "last7Days":
            return last7Days();
        case "last14Days":
            return last14Days();
    }
    return today();
}
