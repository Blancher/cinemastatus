import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';

export default function SeriesCard(props) {
    const navigate = useNavigate();
    const handleCreateRanking = () => navigate(`/new-ranking/${props.id}`);

    return <motion.h2 onClick={handleCreateRanking} whileHover={{scale: 1.1}} className='seriescard'>{props.title}</motion.h2>;
}