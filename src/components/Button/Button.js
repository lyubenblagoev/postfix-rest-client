import './Button.css';

const Button = ({ classNames, onClick, children, type }) => {
    const classes = ['button'].concat(classNames);

    return <button type={type ?? 'button'} className={classes.join(' ')} onClick={onClick}>{children}</button>;
};

export default Button;