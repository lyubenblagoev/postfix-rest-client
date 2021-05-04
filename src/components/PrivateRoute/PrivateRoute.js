import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider/AuthProvider";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated } = useAuth();

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated
                    ? <Component {...props} />
                    : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }
        />
    )
};

export default PrivateRoute;