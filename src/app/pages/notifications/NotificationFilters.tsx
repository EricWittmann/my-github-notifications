import "./NotificationFilters.css";
import {FunctionComponent, useEffect, useState} from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionToggle, Radio, Switch} from "@patternfly/react-core";
import {BugIcon, CodeBranchIcon, CommentsIcon, TagIcon} from "@patternfly/react-icons";
import {DateTime} from "luxon";
import {toDateTime} from "@app/pages/notifications/DateUtil.ts";

export type NotificationFiltersProps = {
    onRangeChange: (since: DateTime) => void;
    onTypesChange: (types: string[]) => void;
    onShowAll: (showAll: boolean) => void;
};


export const NotificationFilters: FunctionComponent<NotificationFiltersProps> = (props: NotificationFiltersProps) => {
    const [expanded, setExpanded] = useState(["section-range", "section-types", "section-showall"]);
    const [range, setRange] = useState<string>("thisWeek");
    const [selectedTypes, setSelectedTypes] = useState<string[]>(["Issue", "Discussion", "PullRequest", "Release"]);
    const [showAll, setShowAll] = useState<boolean>(false);

    const toggle = (id: any) => {
        const index = expanded.indexOf(id);
        const newExpanded: string[] =
            index >= 0 ? [...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length)] : [...expanded, id];
        setExpanded(newExpanded);
    };

    const isTypeSelected = (type: string): boolean => {
        return selectedTypes.indexOf(type) != -1;
    };

    const selectType = (type: string, checked: boolean): void => {
        const newTypes: string[] = selectedTypes.filter(st => st !== type);
        if (checked) {
            newTypes.push(type);
        }
        setSelectedTypes(newTypes);
    }

    useEffect(() => {
        props.onRangeChange(toDateTime(range));
    }, [range]);

    useEffect(() => {
        props.onTypesChange(selectedTypes);
    }, [selectedTypes]);

    useEffect(() => {
        props.onShowAll(showAll);
    }, [showAll]);

    const issuesLabel = <span className="typeLabel"><BugIcon className="typeIcon" /> Issues</span>
    const pullsLabel = <span className="typeLabel"><CodeBranchIcon className="typeIcon" /> Pull Requests</span>
    const discussionsLabel = <span className="typeLabel"><CommentsIcon className="typeIcon" /> Discussions</span>
    const releasesLabel = <span className="typeLabel"><TagIcon className="typeIcon" /> Releases</span>

    return (
        <Accordion className="notification-filters-accordion" asDefinitionList={false} style={{width: "300px"}}>
            <AccordionItem>
                <AccordionToggle
                    onClick={() => toggle("section-range")}
                    isExpanded={expanded.includes("section-range")}
                    id="section-range"
                >
                    Date range
                </AccordionToggle>
                <AccordionContent id="section-range-expand" isHidden={!expanded.includes("section-range")} isFixed>
                    <Radio
                        isChecked={range === "today"}
                        name="range-today"
                        onChange={(evt, checked) => {
                            setRange("today");
                        }}
                        label="Today"
                        id="radio-range-today"
                    ></Radio>
                    <Radio
                        isChecked={range === "last24Hours"}
                        name="range-24hrs"
                        onChange={(evt, checked) => {
                            setRange("last24Hours");
                        }}
                        label="Last 24 hours"
                        id="radio-range-last24Hours"
                    ></Radio>
                    <Radio
                        isChecked={range === "thisWeek"}
                        name="range-this-week"
                        onChange={(evt, checked) => {
                            setRange("thisWeek");
                        }}
                        label="This week"
                        id="radio-range-thisWeek"
                    ></Radio>
                    <Radio
                        isChecked={range === "last7Days"}
                        name="range-7days"
                        onChange={(evt, checked) => {
                            setRange("last7Days");
                        }}
                        label="Last 7 days"
                        id="radio-range-last7Days"
                    ></Radio>
                    <Radio
                        isChecked={range === "last14Days"}
                        name="range-14days"
                        onChange={(evt, checked) => {
                            setRange("last14Days");
                        }}
                        label="Last two weeks"
                        id="radio-range-last14Days"
                    ></Radio>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem>
                <AccordionToggle
                    onClick={() => toggle("section-types")}
                    isExpanded={expanded.includes("section-types")}
                    id="section-types"
                >
                    Notification types
                </AccordionToggle>
                <AccordionContent id="section-types-expand" isHidden={!expanded.includes("section-types")} isFixed>
                    <Switch
                        id="show-issues"
                        label={issuesLabel}
                        labelOff={issuesLabel}
                        className="filter-checkbox"
                        isChecked={isTypeSelected("Issue")}
                        onChange={(evt, checked) => {selectType("Issue", checked)}}
                        ouiaId="BasicSwitch"
                    />
                    <Switch
                        id="show-pulls"
                        label={pullsLabel}
                        labelOff={pullsLabel}
                        className="filter-checkbox"
                        isChecked={isTypeSelected("PullRequest")}
                        onChange={(evt, checked) => {selectType("PullRequest", checked)}}
                        ouiaId="BasicSwitch"
                    />
                    <Switch
                        id="show-discussions"
                        label={discussionsLabel}
                        labelOff={discussionsLabel}
                        className="filter-checkbox"
                        isChecked={isTypeSelected("Discussion")}
                        onChange={(evt, checked) => {selectType("Discussion", checked)}}
                        ouiaId="BasicSwitch"
                    />
                    <Switch
                        id="show-releases"
                        label={releasesLabel}
                        labelOff={releasesLabel}
                        className="filter-checkbox"
                        isChecked={isTypeSelected("Release")}
                        onChange={(evt, checked) => {selectType("Release", checked)}}
                        ouiaId="BasicSwitch"
                    />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem>
                <AccordionToggle
                    onClick={() => toggle("section-showall")}
                    isExpanded={expanded.includes("section-showall")}
                    id="section-showall"
                >
                    Read/Unread
                </AccordionToggle>
                <AccordionContent id="section-showall-expand" isHidden={!expanded.includes("section-showall")} isFixed>
                    <Switch
                        id="show-showall"
                        label="Showing ALL notifications"
                        labelOff="Showing only Unread"
                        className="filter-checkbox"
                        isChecked={showAll}
                        onChange={(evt, checked) => {setShowAll(checked)}}
                        ouiaId="BasicSwitch"
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
