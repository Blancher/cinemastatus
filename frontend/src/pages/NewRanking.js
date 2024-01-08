import {useEffect, useState, useContext} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {motion} from 'framer-motion';
import useInput from '../hooks/useInput';
import Input from '../components/Input';
import Select from '../components/Select';
import useRouteProtection from '../hooks/useRouteProtection';
import useHttp from '../hooks/useHttp';
import Loading from '../components/Loading';
import noDuplicates from '../util/hasDuplicates';
import {context} from '../store/context';

export default function NewRanking() {
    useRouteProtection();
    const ctx = useContext(context);
    const params = useParams();
    const navigate = useNavigate();
    const [error, isLoading, sendRequest] = useHttp();
    const [series, setSeries] = useState({title: '', movies: []});
    const [titleInput, titleValid, titleInputClasses, handleTitleChange, handleTitleBlur, handleTitleSubmit, titleInvalid] = useInput(input => input.length > 0 && input.length <= 30);
    const [ranking, setRanking] = useState([]);
    
    const handleSelect = (index, title, image, valid, handleSubmit) => setRanking(prev => prev.map((movie, i) => i === index ? {title, image, valid, handleSubmit} : movie));
    const handleSubmit = async(e) => {
        e.preventDefault();
        handleTitleSubmit();
        ranking.forEach(movie => movie.handleSubmit());

        if (titleValid && ranking.every(movie => movie.valid) && noDuplicates(ranking.map(movie => movie.title))) {
            try {
                await sendRequest(`ranking/${params.seriesId}`, 'POST', JSON.stringify({title: titleInput, ranking: ranking.map(movie => ({title: movie.title, image: movie.image}))}), {'Content-Type': 'application/json', Authorization: `Bearer ${ctx.token}`});
                navigate('/');
            } catch(err) {
                return;
            }
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest(`series/${params.seriesId}`);
                setSeries(response.series);
            } catch(err) {
                return;
            }
        };

        dataFetcher();
    }, []);
    useEffect(() => {
        if (series.movies.length > 0) {
            setRanking(series.movies.map(series => ({title: '', image: '', valid: false, handleSubmit() {}})));
        }
    }, [series]);

    return (
        <div className='animate'>
            {isLoading && <Loading/>}
            {error && <h2 className='center error'>{error}</h2>}
            {series.movies.length > 0 && (
                <>
                    <h1 className='page'>New <i>{series.title}</i> Ranking</h1>
                    <form onSubmit={handleSubmit}>
                        <Input classes={titleInputClasses} invalid={titleInvalid} message='Title must be between 1 and 30 characters.' inputType='text' placeholder='Title' value={titleInput} onChange={handleTitleChange} onBlur={handleTitleBlur}/>
                        <div className='flex cards'>
                            {ranking.map((movie, i) => <Select key={i} onSelect={handleSelect} i={i} ranking={ranking} movies={series.movies}/>)}
                        </div>
                        <motion.button className='button' whileHover={{scale: 1.1}}>Create Ranking</motion.button>
                    </form>
                </>
            )}
        </div>
    );
}