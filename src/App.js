import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import routes from './app-routes';
import { AuthProvider } from './context/AuthProvider/AuthProvider';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { NotificationsProvider } from './context/NotificationsProvider/NotificationsProvider';
import "./App.css";
import { LoaderProvider } from './context/LoaderProvider/LoaderProvider';

function App() {
    return (
        <div className={'App'}>
            <div className={'App-content'}>
                <div className={'page-content'}>
                    <Switch>
                        {routes.map(({ path, authenticated, component }, key) => {
                            return authenticated === undefined || !authenticated
                                ? <Route exact path={path} key={key} component={component} />
                                : <PrivateRoute exact path={path} key={key} component={component} />
                        })}
                        <Redirect to={'/domains'} />
                    </Switch>
                </div>
            </div>
        </div>
    );
}

export default function AppWithProviders() {
    return (
        <Router>
            <LoaderProvider>
                <AuthProvider>
                    <NotificationsProvider timeout='3000'>
                        <App />
                    </NotificationsProvider>
                </AuthProvider>
            </LoaderProvider>
        </Router>
    )
}
