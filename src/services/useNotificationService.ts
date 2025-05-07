import axios from 'axios';
import {DateTime} from "luxon";

const GH_NOTIFICATION_API_URL: string ="http://localhost:4000/api/notifications";

export interface GitHubNotificationSubject {
    title: string;
    url: string;
    latest_comment_url: string;
    type: string;
}

export interface GitHubNotificationRepository {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    html_url: string;
}

export interface GitHubNotification {
    id: number;
    unread: boolean;
    reason: string;
    updated_at: Date;
    last_read_at: any;
    subject: GitHubNotificationSubject;
    repository: GitHubNotificationRepository;
    url: string;
    subscription_url: string;
}

export interface NotificationService {
    getNotifications(since: DateTime): Promise<GitHubNotification[]>;
    markNotificationAsRead(notification: GitHubNotification): Promise<void>;
}


async function fetchAllNotifications(since: DateTime): Promise<GitHubNotification[]> {
    const results: GitHubNotification[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
        const config = {
            params: {
                all: true,
                page: currentPage,
                per_page: 50,
                since: since.toISO()
            }
        };
        const pagedResults = await axios.get(GH_NOTIFICATION_API_URL, config).then(response => response.data as GitHubNotification[]);
        results.push(...pagedResults);

        hasMorePages = pagedResults.length >= 50;
        currentPage++;
    }

    return results;
}


export const useNotificationService: () => NotificationService = (): NotificationService => {
    return {
        getNotifications(since: DateTime): Promise<GitHubNotification[]> {
            console.info("Getting notifications from GitHub since %s", since.toISO());
            return fetchAllNotifications(since);
        },
        markNotificationAsRead(notification: GitHubNotification): Promise<void> {
            const threadId: string = notification.url.substring(notification.url.indexOf("/threads/") + 9);
            const apiUrl: string = `${GH_NOTIFICATION_API_URL}/threads/${threadId}`;
            return axios.patch(apiUrl);
        }
    };
};
