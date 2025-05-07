import "./NotificationList.css";
import {FunctionComponent} from "react";
import {GitHubNotification} from "@services/useNotificationService.ts";
import {NotificationListItem} from "@app/pages/notifications/NotificationListItem.tsx";

export type NotificationListProps = {
    notifications: GitHubNotification[],
    selectedNotification: GitHubNotification | undefined
    onMarkAsRead: (notification: GitHubNotification) => void,
    onClick: (notification: GitHubNotification) => void,
};

export const NotificationList: FunctionComponent<NotificationListProps> = (props: NotificationListProps) => {
    return (
        <div className="notification-list">
            {props.notifications.map(notification => (
                <NotificationListItem
                    key={notification.id}
                    notification={notification}
                    isSelected={notification === props.selectedNotification}
                    onClick={props.onClick}
                    onMarkAsRead={props.onMarkAsRead}/>
            ))}
        </div>
    );
};
