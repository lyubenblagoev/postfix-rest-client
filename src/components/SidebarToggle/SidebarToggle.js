import './SidebarToggle.css';

const SidebarToggle = (props) => (
    <div onClick={props.onClick} className={'sidebar-toggle-button'}>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default SidebarToggle;