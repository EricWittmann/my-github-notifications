import "./App.css";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";

import {FunctionComponent} from "react";
import {Page} from "@patternfly/react-core";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AppHeader} from "@app/components";
import {NotFoundPage, RootRedirectPage} from "@app/pages";
import {NotificationsPage} from "./pages";

export type AppProps = object;

/**
 * The main application class.
 */
export const App: FunctionComponent<AppProps> = () => {
    return (
        <div className="App">
            <Router basename="/">
                <Page
                    className="pf-m-redhat-font"
                    isManagedSidebar={false}
                    header={<AppHeader />}
                >
                    <Routes>
                        <Route path="/" element={ <RootRedirectPage /> } />
                        <Route path="/notifications" element={ <NotificationsPage /> } />

                        <Route element={ <NotFoundPage /> } />
                    </Routes>
                </Page>
            </Router>
        </div>
    );
};
