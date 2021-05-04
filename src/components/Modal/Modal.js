import Backdrop from '../Backdrop/Backdrop';
import './Modal.css';

const Modal = ({ show, children }) => {
    return (
        <>
            <Backdrop show={show} />
            <div className={'modal'} style={{ display: show ? '' : 'none' }}>
                {children}
            </div>
        </>
    )
}

export default Modal;