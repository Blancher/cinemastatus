import {useContext, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import useHttp from '../hooks/useHttp';
import {context} from '../store/context';

export default function RankingCard(props) {
    const ctx = useContext(context);
    const navigate = useNavigate();
    const [error, isLoading, sendRequest] = useHttp();
    const [deleting, setDeleting] = useState(false);
    const [liked, setLiked] = useState(props.likes.includes(ctx.userId));
    const [disliked, setDisliked] = useState(props.dislikes.includes(ctx.userId));
    const [likes, setLikes] = useState(props.likes.length);
    const [dislikes, setDislikes] = useState(props.dislikes.length);

    const handleView = () => navigate(`/view-ranking/${props.id}`);
    const handleEdit = e => {
        e.stopPropagation();
        navigate(`/update-ranking/${props.id}/${props.series.id}`)
    };
    const handleShowModal = e => {
        e.stopPropagation();
        setDeleting(true);
    };
    const handleCloseModal = () => setDeleting(false);
    const handleDelete = () => {
        props.onDelete();
        handleCloseModal();
    };
    const handleVote = async(e, path) => {
        e.stopPropagation();

        try {
            await sendRequest(`ranking/${path}/${props.id}`, 'PATCH', null, {Authorization: `Bearer ${ctx.token}`});

            if (path.includes('dislike')) {
                setDisliked(prev => !prev);
                path.includes('un') ? setDislikes(prev => prev - 1) : setDislikes(prev => prev + 1);
            } else {
                setLiked(prev => !prev);
                path.includes('un') ? setLikes(prev => prev - 1) : setLikes(prev => prev + 1);
            }
        } catch(err) {
            return;
        }
    }
    
    return (
        <AnimatePresence initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
            <motion.div onClick={handleView} whileHover={{scale: 1.1}} className='rankingcard'>
                <h3 className='center'>{props.title}</h3>
                <h4 className='center'>By {props.creator.username}</h4>
                <h5 className='center'>{props.series.title} Series</h5>
                {props.use && (
                    <>
                        <AnimatePresence>
                            {ctx.isLoggedIn && (
                                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 1}} className='vote flex'>
                                    <motion.button className={liked ? 'selected' : ''} onClick={e => handleVote(e, liked ? 'unlike' : 'like')} initial={{scale: .92}} whileHover={{scale: 1.02}}>{likes} ✓</motion.button>
                                    <motion.button className={disliked ? 'selected' : ''} onClick={e => handleVote(e, disliked ? 'undislike' : 'dislike')} whileHover={{scale: 1.1}}>{dislikes} ✗</motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {ctx.userId === props.creator.id && (
                                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className='change flex'>
                                    <motion.button onClick={handleEdit} whileHover={{scale: 1.1}}>Edit</motion.button>
                                    <motion.button onClick={handleShowModal} whileHover={{scale: 1.1}}>Delete</motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </motion.div>
            <AnimatePresence>
                {deleting && <motion.div initial={{opacity: 0}} animate={{opacity: .5}} exit={{opacity: 0}} className='background'></motion.div>}
            </AnimatePresence>
            <AnimatePresence>
                {deleting && (
                    <motion.div id='modal' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                        <p id='delete'>Are you sure you want to delete <i>{props.title}</i>?</p>
                        <div id='deletebuttons' className='flex'>
                            <motion.button onClick={handleDelete} whileHover={{scale: 1.1}}>Yes</motion.button>
                            <motion.button onClick={handleCloseModal} whileHover={{scale: 1.1}}>No</motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AnimatePresence>
    );
}