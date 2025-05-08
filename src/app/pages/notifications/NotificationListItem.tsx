import "./NotificationListItem.css";
import {FunctionComponent} from "react";
import {GitHubNotification} from "@services/useNotificationService.ts";
import {BugIcon} from "@patternfly/react-icons";
import {NotificationListItemIcon} from "@app/pages";
import {FromNow, If} from "@apicurio/common-ui-components";
import {Button} from "@patternfly/react-core";

function getLastUrlSegment(url: string): string {
    try {
        const parsedUrl = new URL(url);
        const path = parsedUrl.pathname.replace(/\/+$/, ''); // Remove trailing slashes
        const segments = path.split('/');
        return segments.length > 0 ? segments[segments.length - 1] : '';
    } catch (error) {
        console.error('Invalid URL:', error);
        return '';
    }
}


export type NotificationListItemProps = {
    notification: GitHubNotification,
    isSelected: boolean
    onMarkAsRead: (notification: GitHubNotification) => void,
    onClick: (notification: GitHubNotification) => void,
};

export const NotificationListItem: FunctionComponent<NotificationListItemProps> = (props: NotificationListItemProps) => {
    const notificationNumber: string = getLastUrlSegment(props.notification.subject.url);
    const repoUrl: string = props.notification.repository.html_url;
    let webUrl: string = props.notification.subject.url;
    if (props.notification.subject.type === "PullRequest") {
        webUrl = repoUrl + "/pull/" + notificationNumber;
    } else if (props.notification.subject.type === "Issue") {
        webUrl = repoUrl + "/issues/" + notificationNumber;
    } else if (props.notification.subject.type === "Discussion") {
        webUrl = repoUrl + "/discussions/" + notificationNumber;
    }

    const readUnreadClass = props.notification.unread ? "unread" : "read";
    const selectedClass = props.isSelected ? "selected" : "";

    return (
        <div className={`notification-list-item ${readUnreadClass} ${selectedClass}`} onClick={() => props.onClick(props.notification)}>
            <div className="nli-icon">
                <NotificationListItemIcon notification={props.notification}/>
            </div>
            <div className="nli-summary">
                <div className="nli-repo">
                    <a target="_blank" className="nli-repo-url" href={props.notification.repository.html_url}>
                        {props.notification.repository.full_name}
                    </a>
                    <a target="_blank" className="nli-item-url" href={webUrl}>
                        #{getLastUrlSegment(props.notification.subject.url)}
                    </a>
                </div>
                <div className="nli-title">
                    {props.notification.subject.title}
                </div>
            </div>
            <div className="nli-reason">
                {props.notification.reason}
            </div>
            <div className="nli-updated">
                <FromNow date={props.notification.updated_at}/>
            </div>
            <If condition={props.notification.unread}>
                <div className="nli-actions">
                    <Button variant="secondary" ouiaId="MarkAsRead"
                            onClick={(evt) => {
                                props.onMarkAsRead(props.notification)
                                evt.stopPropagation();
                            }}>
                        Mark as read
                    </Button>
                </div>
            </If>
        </div>
    );
};
