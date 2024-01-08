import {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {context} from '../store/context';
import RankingCard from '../components/RankingCard';
import Loading from '../components/Loading';
import useHttp from '../hooks/useHttp';

export default function Rankings() {
    const ctx = useContext(context);
    const navigate = useNavigate();
    const [error, isLoading, sendRequest] = useHttp();
    const [rankings, setRankings] = useState([]);
    const [series, setSeries] = useState([]);
    const [ranking, setRanking] = useState('All');
    const [empty, setEmpty] = useState(false);

    const handleRedirect = () => navigate('/choose-series');
    const handleRankingChange = e => setRanking(e.target.value);
    const handleDelete = async(id) => {
        try {
            await sendRequest(`ranking/${id}`, 'DELETE', null, {Authorization: `Bearer ${ctx.token}`});
            setRankings(prev => prev.filter(ranking => ranking.id !== id));
        } catch(err) {
            return;
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            setEmpty(false);
            const response = ranking === 'All' ? await sendRequest('ranking') : await sendRequest(`ranking/series/${series.find(series => series.title === ranking).id}`);
            const rankings = response.rankings;
            const randomRankings = [];
            let n = rankings.length;

            if (n === 0) {
                setEmpty(true);
            }

            for (let i = 0; i < n; i++) {
                const random = Math.floor(Math.random() * rankings.length);
                randomRankings.includes(rankings[random]) ? n++ : randomRankings.push(rankings[random]);
            }

            setRankings(randomRankings);
        };

        dataFetcher();
    }, [ranking]);

    useEffect(() => {
        const dataFetcher = async() => {
            const response = await sendRequest('series');
            setSeries(response.series);
        };

        dataFetcher();
    }, []);
    
    return (
        <div className='animate'>
            <h1 className='page'>Rankings</h1>
            <p id='desc'>Welcome to CinemaStatus! CinemaStatus is a website where you can create rankings of all the films in a movie series from first to last. The movie series CinemaStatus allows you to create rankings of are Mission: Impossible, Back to the Future, The Matrix, The Dark Knight, Star Wars, Indiana Jones, Captain America, Iron Man, Avengers, Harry Potter, and Terminator.</p>
            <motion.button onClick={handleRedirect} whileHover={{scale: 1.1}} style={{opacity: ctx.isLoggedIn ? 1 : 0, visibility: ctx.isLoggedIn ? 'visible' : 'hidden'}} className='button'>Create Ranking</motion.button>
            <motion.div style={{opacity: series.length > 0 ? 1 : 0, visibility: series.length > 0 ? 'visible' : 'hidden'}} id='choose' className='flex'>
                <div>
                    <p>Movie Series</p>
                    <select onChange={handleRankingChange}>
                        <option value='All'>All</option>
                        {series.map(series => <option value={series.tilte}>{series.title}</option>)}
                    </select>
                </div>
            </motion.div>
            {isLoading && <Loading/>}
            {error && <h2 className='center error'>{error}</h2>}
            {empty && <h2 className='center'>No rankings.</h2>}
            {rankings.length > 0 && (
                <div className='flex cards'>
                    {rankings.map(ranking => <RankingCard key={ranking.id} use onDelete={() => handleDelete(ranking.id)} {...ranking}/>)}
                </div>
            )}
        </div>
    );
}