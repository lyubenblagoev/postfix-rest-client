import React from 'react';
import { Link, Route } from "react-router-dom";
import routes from "../../app-routes";
import './breadcrumb.css';

const WithBreadcrumb = (Component) => {
    return React.useCallback((props) => {
        return (
            <>
                {routes.map(({ path, link }, key) => (
                    <Route
                        exact
                        path={path}
                        key={key}
                        render={props => {
                            const crumbs = routes
                                .filter(({ path }) => props.match.path.includes(path))
                                .map(({ path, link, ...rest }) => ({
                                    path: Object.keys(props.match.params).length
                                        ? Object.keys(props.match.params).reduce((path, param) => path.replace(`:${param}`, props.match.params[param]), path)
                                        : path,
                                    link: Object.keys(props.match.params).length
                                        ? Object.keys(props.match.params).reduce((link, param) => link.replace(`:${param}`, props.match.params[param]), link)
                                        : link,
                                    ...rest
                                }));
                            return (
                                <div className={'bread-crumb-wrapper'}>
                                    {crumbs.map(({ link, path }, key) =>
                                        key + 1 === crumbs.length
                                            ? (
                                                <div className={'bread-crumb'} key={key}>
                                                    <span>&nbsp;/&nbsp;</span>
                                                    {link}
                                                </div>
                                            )
                                            : (
                                                <div className={'bread-crumb'} key={key}>
                                                    <span>&nbsp;/&nbsp;</span>
                                                    <Link to={path}>{link}</Link>
                                                </div>
                                            )
                                    )}
                                </div>
                            );
                        }}
                    />
                ))}
                <Component {...props} />
            </>
        )
    }, []);
};

export default WithBreadcrumb;