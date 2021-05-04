import { Link } from 'react-router-dom';
import './List.css';

function List({ items, renderLink, renderLabel }) {
    return (
        <ul className="item-list">
            {items.map((item) => (
                <Link to={renderLink(item)} key={item.id}>
                    <li className={item.enabled ? '' : 'disabled'}>
                        <div>
                            {renderLabel(item)}
                        </div>
                    </li>
                </Link>
            ))}
        </ul>
    )
}

export default List;