import FadeLoader from 'react-spinners/FadeLoader'
import { useLoader } from '../../context/LoaderProvider/LoaderProvider';

const LoaderContainer = (props) => {
    const { loading } = useLoader();
    return (
        <FadeLoader
            css={'width: 60px; top: 20%; left: 50%; z-index: 500'}
            color={'#fd5a19'}
            loading={loading === true}
            size={'20px'} />
    );
};

export default LoaderContainer;