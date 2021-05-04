import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import routes from '../../app-routes';
import SidebarToggle from '../SidebarToggle/SidebarToggle';
import NotificationsContainer from '../NotificationsContainer/NotificationsContainer';
import LoaderContainer from '../LoaderContainer/LoaderContainer';
import './InnerPageContainer.css';
import { useAuth } from '../../context/AuthProvider/AuthProvider';

const InnerPageContainer = ({ children }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const { isAuthenticated } = useAuth();

    const onSidebarClick = () => {
        setShowSidebar(!showSidebar);
    };

    const classes = showSidebar ? 'open' : '';

    return (
        <>
            <div className={'inner-page-header'}>
                <SidebarToggle onClick={onSidebarClick} />
                <div className={'logo'}>
                    <FontAwesomeIcon icon={faUsers} />
                    Postfix Rest Server<br />
                    <small>Control Panel</small>
                </div>
                <nav className={classes}>
                    <ul>
                        {routes
                            .filter(route => route.showInNavbar)
                            .map(({ link, path }, key) => (
                                <NavLink key={key} to={path} activeClassName="active">
                                    <li>{link}</li>
                                </NavLink>
                            ))}
                        {isAuthenticated
                            ? (
                                <>
                                    <NavLink key={'profile'} to={'/profile'} activeClassName="active"><li>Profile</li></NavLink>
                                    <NavLink key={'logout'} to={'/login?logout=1'}><li>Logout</li></NavLink>
                                </>
                            )
                            : (
                                <NavLink key={'login'} to={'/login'} activeClassName="active"><li>Login</li></NavLink>
                            )}
                    </ul>
                </nav>
            </div>
            <div className={'inner-page-content'}>
                <NotificationsContainer />
                <LoaderContainer />
                {children}
            </div>
        </>
    )
}

export default InnerPageContainer;