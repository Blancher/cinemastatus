import {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {motion} from 'framer-motion';
import MovieCard from '../components/MovieCard';
import useHttp from '../hooks/useHttp';
import useVote from '../hooks/useVote';
import Loading from '../components/Loading';
import {context} from '../store/context';

export default function SingleRanking() {
    const params = useParams();
    const ctx = useContext(context);
    const [error, isLoading, sendRequest] = useHttp();
    const [ranking, setRanking] = useState({title: '', ranking: []});
    const [liked, disliked, likes, dislikes, handleVote, setLikes, setDislikes, setId] = useVote([], [], null);

    useEffect(() => {
        const dataFetcher = async() => {
            const response = await sendRequest(`ranking/${params.rankingId}`);
            setRanking(response.ranking);
            setLikes(response.ranking.likes);
            setDislikes(response.ranking.dislikes);
            setId(response.ranking.id);
        };

        dataFetcher();
    }, []);

    return (
        <div className='animate'>
            {isLoading && <Loading/>}
            {error && <h2 className='center error'>{error}</h2>}
            {ranking.ranking.length > 0 && (
                <>
                    <h1 className='page'>{ranking.title}</h1>
                    <h2 id='user' className='page'>{ranking.creator.username}</h2>
                    {ctx.isLoggedIn && (
                        <div id='rankingvote' className='flex'>
                            <motion.button className={liked ? 'selected' : ''} onClick={e => handleVote(e, liked ? 'unlike' : 'like')} initial={{scale: .92}} whileHover={{scale: 1.02}}>{likes.length} ✓</motion.button>
                            <motion.button className={disliked ? 'selected' : ''} onClick={e => handleVote(e, disliked ? 'undislike' : 'dislike')} whileHover={{scale: 1.1}}>{dislikes.length} ✗</motion.button>
                        </div>
                    )}
                    <div id='movies' className='flex'>
                        {ranking.ranking.map((movie, i) => <MovieCard key={i} rank={i+1} {...movie}/>)}
                    </div>
                </>
            )}
        </div>
    );
}
