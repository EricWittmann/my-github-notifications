import {FunctionComponent} from "react";
import {Brand, Masthead, MastheadBrand, MastheadContent, MastheadMain} from "@patternfly/react-core";


export type AppHeaderProps = object;


export const AppHeader: FunctionComponent<AppHeaderProps> = () => {

    const logoSrc: string = `/app-logo.png`;

    return (
        <Masthead id="icon-router-link">
            <MastheadMain>
                <MastheadBrand>
                    <Brand src={logoSrc} alt="My GitHub Notifications" heights={{ default: "36px" }} />
                </MastheadBrand>
            </MastheadMain>
            <MastheadContent>
            </MastheadContent>
        </Masthead>
    );
};
