import {useEffect} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import useInput from '../hooks/useInput';

export default function Select(props) {
    const [input, valid, inputClasses, handleChange, handleBlur, handleSubmit, invalid, setInput] = useInput(input => input.length > 0 && props.ranking.filter(movie => movie.title === input).length < 2);
    
    useEffect(() => props.onSelect(props.i, input, input.length > 0 ? props.movies.find(movie => movie.title === input).image : '', valid, handleSubmit), [input]);
    useEffect(() => {
        if (props.title) {
            setInput(props.title);
        }
    }, []);

    return (
        <div className={inputClasses}>
            <AnimatePresence>
                {invalid && <motion.p className='label center' initial={{height: 0, opacity: 0}} animate={{height: 16, opacity: 1}} exit={{height: 0, opacity: 0}}>{input.length === 0 ? 'Movie selection can\'t be empty.' : 'Movie is already selected.'}</motion.p>}
            </AnimatePresence>
            <div className='flex'>
                <h2 className='number'>{props.i+1}</h2>
                <select onChange={handleChange} onBlur={handleBlur}>
                    <option value=''>--select--</option>
                    {props.movies.map((movie, i) => <option selected={input === movie.title} key={i} value={movie.title}>{movie.title}</option>)}
                </select>
            </div>
        </div>
    );
}