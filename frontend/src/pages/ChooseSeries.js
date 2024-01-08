import {useEffect, useState} from 'react';
import useRouteProtection from '../hooks/useRouteProtection';
import SeriesCard from '../components/SeriesCard';
import useHttp from '../hooks/useHttp';
import Loading from '../components/Loading';

export default function ChooseRanking() {
    useRouteProtection();
    const [error, isLoading, sendRequest] = useHttp();
    const [series, setSeries] = useState([]);

    useEffect(() => {
        const dataFetcher = async() => {
            const response = await sendRequest('series');
            setSeries(response.series);
        };

        dataFetcher();
    }, []);

    return (
        <div className='animate'>
            <h1 className='page'>Choose Series</h1>
            {isLoading && <Loading/>}
            {error && <h2 className='error center'>{error}</h2>}
            {series.length > 0 && (
                <div className='flex cards'>
                    {series.map((series, i) => <SeriesCard key={i} {...series}/>)}
                </div>
            )}
        </div>
    );
}