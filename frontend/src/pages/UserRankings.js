import {useContext, useEffect, useState} from 'react';
import RankingCard from '../components/RankingCard';
import useRouteProtection from '../hooks/useRouteProtection';
import {context} from '../store/context';
import useHttp from '../hooks/useHttp';
import Loading from '../components/Loading';

export default function UserRankings() {
    useRouteProtection();
    const ctx = useContext(context);
    const [error, isLoading, sendRequest] = useHttp();
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        const dataFetcher = async() => {
            const response = await sendRequest('ranking/empty');
            setRankings(response.rankings.filter(ranking => ranking.creator.id === ctx.userId));
        };

        dataFetcher();
    }, []);
    
    return (
        <div className='animate'>
            <h1 className='page'>Your Rankings</h1>
            {isLoading && <Loading/>}
            {error && <h2 className='center error'>{error}</h2>}
            {rankings.length > 0 && (
                <div className='flex cards'>
                    {rankings.map((ranking, i) => <RankingCard key={i} {...ranking}/>)}
                </div>
            )}
        </div>
    );
}
