import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import useHttp from '../hooks/useHttp';
import Loading from '../components/Loading';

export default function SingleRanking() {
    const params = useParams();
    const [error, isLoading, sendRequest] = useHttp();
    const [ranking, setRanking] = useState({title: '', ranking: []});

    useEffect(() => {
        const dataFetcher = async() => {
            const response = await sendRequest(`ranking/${params.rankingId}`);
            setRanking(response.ranking);
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
                    <div id='movies' className='flex'>
                        {ranking.ranking.map((movie, i) => <MovieCard key={i} rank={i+1} {...movie}/>)}
                    </div>
                </>
            )}
        </div>
    );
}
