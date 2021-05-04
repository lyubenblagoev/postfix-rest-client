import './Backdrop.css';

const Backdrop = ({ show }) => (
    show ? <div className={'backdrop'}></div> : null
);

export default Backdrop;