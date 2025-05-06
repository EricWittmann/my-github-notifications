import "./NotificationListItemIcon.css";
import {FunctionComponent} from "react";
import {GitHubNotification} from "@services/useNotificationService.ts";
import {BugIcon, CodeBranchIcon, CommentsIcon, InfoCircleIcon, TagIcon} from "@patternfly/react-icons";


export type NotificationListItemIconProps = {
    notification: GitHubNotification;
};

export const NotificationListItemIcon: FunctionComponent<NotificationListItemIconProps> = (props: NotificationListItemIconProps) => {
    const type: string = props.notification?.subject?.type;
    let icon = <InfoCircleIcon title={props.notification?.subject?.type} />;
    if (type == "PullRequest") {
        icon = <CodeBranchIcon title={props.notification?.subject?.type} />
    } else if (type === "Issue") {
        icon = <BugIcon title={props.notification?.subject?.type} />
    } else if (type === "Discussion") {
        icon = <CommentsIcon title={props.notification?.subject?.type} />
    } else if (type === "Release") {
        icon = <TagIcon title={props.notification?.subject?.type} />
    }

    return icon;

};
