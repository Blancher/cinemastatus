import {useContext, useState, useEffect} from 'react';
import {context} from '../store/context';
import useHttp from '../hooks/useHttp';

export default function useVote(propsLikes, propsDislikes, propsId) {
    const ctx = useContext(context);
    const [error, isLoading, sendRequest] = useHttp();
    const [liked, setLiked] = useState(propsLikes.includes(ctx.userId));
    const [disliked, setDisliked] = useState(propsDislikes.includes(ctx.userId));
    const [likes, setLikes] = useState(propsLikes);
    const [dislikes, setDislikes] = useState(propsDislikes);
    const [id, setId] = useState(propsId);

    const handleVote = async(e, path) => {
        e.stopPropagation();

        if (path.includes('dislike')) {
            setDisliked(prev => !prev);
            path.includes('un') ? setDislikes(prev => prev.filter(id => id.toString() !== ctx.userId.toString())) : setDislikes(prev => [...prev, ctx.userId]);
        } else {
            setLiked(prev => !prev);
            path.includes('un') ? setLikes(prev => prev.filter(id => id.toString() !== ctx.userId.toString())) : setLikes(prev => [...prev, ctx.userId]);
        }

        try {
            await sendRequest(`ranking/${path}/${id}`, 'PATCH', null, {Authorization: `Bearer ${ctx.token}`});
        } catch(err) {
            return;
        }
    }

    useEffect(() => {
        setLiked(likes.includes(ctx.userId));
        setDisliked(dislikes.includes(ctx.userId));
    }, [likes, dislikes]);

    return [liked, disliked, likes, dislikes, handleVote, setLikes, setDislikes, setId];
}
