import "./NotificationList.css";
import {FunctionComponent} from "react";
import {GitHubNotification} from "@services/useNotificationService.ts";
import {NotificationListItem} from "@app/pages/notifications/NotificationListItem.tsx";

export type NotificationListProps = {
    notifications: GitHubNotification[];
    onMarkAsRead: (notification: GitHubNotification) => void;
};

export const NotificationList: FunctionComponent<NotificationListProps> = (props: NotificationListProps) => {
    return (
        <div className="notification-list">
            {props.notifications.map(notification => (
                <NotificationListItem key={notification.id} notification={notification} onMarkAsRead={props.onMarkAsRead} />
            ))}
        </div>
    );
};
