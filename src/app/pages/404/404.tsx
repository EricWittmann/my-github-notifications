import {FunctionComponent} from "react";
import {
    EmptyState,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateHeader,
    EmptyStateIcon,
    EmptyStateVariant,
    PageSection,
    PageSectionVariants
} from "@patternfly/react-core";
import {ExclamationCircleIcon} from "@patternfly/react-icons";
import {PageProperties} from "@app/pages";


/**
 * The "not found" page.
 */
export const NotFoundPage: FunctionComponent<PageProperties> = () => {
    return  (
        <PageSection className="ps_rules-header" variant={PageSectionVariants.light}>
            <EmptyState variant={EmptyStateVariant.full}>
                <EmptyStateHeader titleText="404 Error: page not found" headingLevel="h4" icon={<EmptyStateIcon icon={ExclamationCircleIcon} />} />
                <EmptyStateBody>
                    This page couldn't be found.  If you think this is a bug, please report the issue.
                </EmptyStateBody>
                <EmptyStateFooter>
                </EmptyStateFooter>
            </EmptyState>
        </PageSection>
    );

};
