import { useCallback, useState, createContext, useContext, useEffect } from "react";

const NotificationsProvider = (props) => {
    const [notifications, setNotifications] = useState([]);

    const timeout = props.timeout ?? 3000;

    useEffect(() => {
        return () => {
            notifications.forEach(n => n.clear());
            setNotifications([]);
        }
    }, []);

    const notify = useCallback((message, type) => {
        const notification = {
            text: message,
            type: type,
            clear: () => {
                setNotifications(notifications => notifications.filter(n => n !== notification));
            }
        };

        setNotifications(notifications => [...notifications, notification]);

        setTimeout(() => {
            setNotifications(notifications => notifications.filter(n => n !== notification));
        }, timeout);
    }, []);

    const info = useCallback((message) => notify(message, "info"), [notify]);
    const warn = useCallback((message) => notify(message, "warn"), [notify]);
    const error = useCallback((message) => notify(message, "error"), [notify]);

    return (
        <NotificationsContext.Provider value={{ notifications, info, warn, error }} {...props} />
    );
};

const NotificationsContext = createContext({});
const useNotifications = () => useContext(NotificationsContext);

export { NotificationsProvider, useNotifications };