import {FunctionComponent} from "react";
import {Brand, Masthead, MastheadBrand, MastheadContent, MastheadMain} from "@patternfly/react-core";


export type AppHeaderProps = object;


export const AppHeader: FunctionComponent<AppHeaderProps> = () => {

    const logoSrc: string = `/vite.svg`;

    return (
        <Masthead id="icon-router-link">
            <MastheadMain>
                <MastheadBrand>
                    <Brand src={logoSrc} alt="Logo" heights={{ default: "36px" }} />
                    <span style={{ fontFamily: "monospace", fontSize: "22px", fontWeight: "bold", marginLeft: "15px" }}>My GitHub Notifications</span>
                </MastheadBrand>
            </MastheadMain>
            <MastheadContent>
            </MastheadContent>
        </Masthead>
    );
};
