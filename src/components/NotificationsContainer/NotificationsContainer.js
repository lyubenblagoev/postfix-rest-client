import { useNotifications } from '../../context/NotificationsProvider/NotificationsProvider';
import './NotificationsContainer.css';

const NotificationsContainer = (props) => {
    const { notifications } = useNotifications();

    return (
        <div className={'notifications-container-wrapper'}>
            {notifications.map((notification, index) => (
                <div key={index} className={`notifications-container ${notification.type}`}>
                    {notification.text}
                    <div onClick={() => notification.clear(notification)} className={'close-button'}>
                        <div className={'close-button1'}>
                            <div className={'close-button2'}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationsContainer;