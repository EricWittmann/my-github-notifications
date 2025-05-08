import {FunctionComponent, useEffect, useState} from "react";
import "./NotificationsPage.css";
import {
    Alert,
    AlertActionLink,
    EmptyState,
    EmptyStateBody,
    EmptyStateHeader,
    PageSection,
    PageSectionVariants,
    Spinner
} from "@patternfly/react-core";
import {
    NotificationFilters,
    NotificationList,
    PageDataLoader,
    PageError,
    PageErrorHandler,
    PageProperties
} from "@app/pages";
import {GitHubNotification, NotificationService, useNotificationService} from "@services/useNotificationService.ts";
import {DateTime} from "luxon";
import {today} from "@app/pages/notifications/DateUtil.ts";
import {IfNotEmpty, IfNotLoading} from "@apicurio/common-ui-components";
import {WarningTriangleIcon} from "@patternfly/react-icons";
import {useInterval} from "react-use";


/**
 * The notifications page.
 */
export const NotificationsPage: FunctionComponent<PageProperties> = () => {
    const [since, setSince] = useState<DateTime>(today);
    const [types, setTypes] = useState<string[]>(["Issues"])
    const [showAll, setShowAll] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lastFetched, setLastFetched] = useState<DateTime>();
    const [newNotifications, setNewNotifications] = useState<GitHubNotification[]>([]);
    const [newNotificationCount, setNewNotificationCount] = useState(0);
    const [newNotificationFilteredCount, setNewNotificationFilteredCount] = useState(0);

    const [pageError, setPageError] = useState<PageError>();
    const [loaders, setLoaders] = useState<Promise<any> | Promise<any>[] | undefined>();
    const [notifications, setNotifications] = useState<GitHubNotification[]>([]);
    const [filteredNotifications, setFilteredNotifications] = useState<GitHubNotification[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<GitHubNotification>();

    const notificationService: NotificationService = useNotificationService();

    const markAsRead = (notification: GitHubNotification): void => {
        notificationService.markNotificationAsRead(notification);
        notification.unread = false;
        setNotifications([...notifications]);
    };

    const onNotificationClick = (notification: GitHubNotification): void => {
        if (notification !== selectedNotification) {
            setSelectedNotification(notification);
        } else {
            setSelectedNotification(undefined);
        }
    };

    const filterNotifications = (notifications: GitHubNotification[]): GitHubNotification[] => {
        return notifications.filter(notification => {
            return types.indexOf(notification.subject.type) != -1 && (showAll || notification.unread)
        })
    }

    const refresh = (): void => {
        setSince(since.plus({}));
    };

    useInterval(() => {
        console.info("Checking (periodic) for new notifications since: ", lastFetched?.toISO());
        if (lastFetched) {
            notificationService.getNotifications(lastFetched).then(setNewNotifications);
        } else {
            console.info("Skipping new notification check (no last-fetched)");
        }
    }, 60000)

    useEffect(() => {
        setLoaders([]);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        notificationService.getNotifications(since).then(notifications => {
            setNotifications(notifications);
            setLastFetched(DateTime.now());
            setNewNotifications([]);
            setIsLoading(false);
        }).catch(error => {
            // TODO error handling??
            setNotifications([]);
            setIsLoading(false);
        })
    }, [since]);

    useEffect(() => {
        console.info(`Filtering a total of ${notifications.length} notifications.`)
        setFilteredNotifications(filterNotifications(notifications));
    }, [notifications, types, showAll]);

    useEffect(() => {
        const filtered = filterNotifications(newNotifications);
        setNewNotificationCount(newNotifications.length);
        setNewNotificationFilteredCount(filtered.length);
    }, [newNotifications]);

    const loadingComponent = (
        <EmptyState>
            <EmptyStateHeader titleText="Loading notifications" headingLevel="h4" icon={<Spinner />} />
            <EmptyStateBody>
                Please wait while your notifications are loaded from GitHub.
            </EmptyStateBody>
        </EmptyState>
    );

    const noNotifications = (
        <EmptyState>
            <EmptyStateHeader titleText="Notifications not found" headingLevel="h4" icon={<WarningTriangleIcon />} />
            <EmptyStateBody>
                There are no notifications found that match your filter options.
            </EmptyStateBody>
        </EmptyState>
    );


    return (
        <PageErrorHandler error={pageError}>
            <PageDataLoader loaders={loaders}>
                <PageSection className="ps_notifications-header" variant={PageSectionVariants.light} padding={{ default: "noPadding" }}>
                </PageSection>
                <PageSection className="ps_notifications-content" padding={{ default: "noPadding" }} isFilled={true} variant={PageSectionVariants.light}>
                    <div className="notification-container">
                        <div className="notification-filters">
                            <NotificationFilters onRangeChange={setSince} onTypesChange={setTypes} onShowAll={setShowAll} />
                        </div>
                        <div className="notification-items">
                            <IfNotLoading isLoading={isLoading} loadingComponent={loadingComponent}>
                                <IfNotEmpty collection={newNotifications} emptyState={<></>}>
                                    <Alert
                                        style={{ marginBottom: "5px" }}
                                        variant="info"
                                        title="New notifications detected"
                                        actionLinks={
                                            <>
                                                <AlertActionLink onClick={() => refresh()}>
                                                    Refresh
                                                </AlertActionLink>
                                            </>
                                        }
                                    >
                                        <p>{ newNotificationCount } new (<b>{ newNotificationFilteredCount } matching</b>) notifications have been detected.</p>
                                    </Alert>
                                </IfNotEmpty>
                                <IfNotEmpty
                                    collection={filteredNotifications}
                                    emptyState={noNotifications}
                                >
                                    <NotificationList
                                        notifications={filteredNotifications}
                                        selectedNotification={selectedNotification}
                                        onMarkAsRead={markAsRead}
                                        onClick={onNotificationClick} />
                                </IfNotEmpty>
                            </IfNotLoading>
                        </div>
                    </div>
                </PageSection>
            </PageDataLoader>
        </PageErrorHandler>
    );

};
