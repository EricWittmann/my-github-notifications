import { FunctionComponent } from "react";
import { Navigate } from "react-router-dom";
import { PageProperties } from "@app/pages";


/**
 * The root redirect page.
 */
export const RootRedirectPage: FunctionComponent<PageProperties> = () => {
    const redirect: string = "/notifications";
    return (
        <Navigate to={redirect} replace />
    );

};
