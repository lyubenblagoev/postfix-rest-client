import './Card.css';

const Card = (props) => (
    <div className={'card'}>
        {props.children}
    </div>
)

export default Card;