import {FunctionComponent, useEffect, useState} from "react";
import "./NotificationsPage.css";
import {
    EmptyState,
    EmptyStateBody,
    EmptyStateFooter,
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
import {BatteryEmptyIcon, WarningTriangleIcon} from "@patternfly/react-icons";


/**
 * The notifications page.
 */
export const NotificationsPage: FunctionComponent<PageProperties> = () => {
    const [since, setSince] = useState<DateTime>(today);
    const [types, setTypes] = useState<string[]>(["Issues"])
    const [showAll, setShowAll] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [pageError, setPageError] = useState<PageError>();
    const [loaders, setLoaders] = useState<Promise<any> | Promise<any>[] | undefined>();
    const [notifications, setNotifications] = useState<GitHubNotification[]>([]);
    const [filteredNotifications, setFilteredNotifications] = useState<GitHubNotification[]>([]);

    const notificationService: NotificationService = useNotificationService();

    const markAsRead = (notification: GitHubNotification): void => {
        notificationService.markNotificationAsRead(notification);
        notification.unread = false;
        setNotifications([...notifications]);
    };

    useEffect(() => {
        setLoaders([]);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        notificationService.getNotifications(since).then(notifications => {
            setNotifications(notifications);
            setIsLoading(false);
        }).catch(error => {
            // TODO error handling??
            setNotifications([]);
            setIsLoading(false);
        })
    }, [since]);

    useEffect(() => {
        console.info(`Filtering a total of ${notifications.length} notifications.`)
        setFilteredNotifications(notifications.filter(notification => {
            return types.indexOf(notification.subject.type) != -1 && (showAll || notification.unread)
        }));
    }, [notifications, types, showAll]);

    const loadingComponent = (
        <EmptyState>
            <EmptyStateHeader titleText="Loading notifications" headingLevel="h4" icon={<Spinner />} />
            <EmptyStateBody>
                Please wait while your notifications are loaded from GitHub.
            </EmptyStateBody>
            <EmptyStateFooter>
            </EmptyStateFooter>
        </EmptyState>
    );

    const noNotifications = (
        <EmptyState>
            <EmptyStateHeader titleText="Notifications not found" headingLevel="h4" icon={<WarningTriangleIcon />} />
            <EmptyStateBody>
                There are no notifications found that match your filter options.
            </EmptyStateBody>
            <EmptyStateFooter>
            </EmptyStateFooter>
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
                                <IfNotEmpty
                                    collection={filteredNotifications}
                                    emptyState={noNotifications}
                                >
                                    <NotificationList notifications={filteredNotifications} onMarkAsRead={markAsRead} />
                                </IfNotEmpty>
                            </IfNotLoading>
                        </div>
                    </div>
                </PageSection>
            </PageDataLoader>
        </PageErrorHandler>
    );

};
