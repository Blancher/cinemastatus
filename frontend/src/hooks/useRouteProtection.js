import {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {context} from '../store/context';

export default function useRouteProtection() {
    const ctx = useContext(context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!ctx.isLoggedIn) {
            navigate('/login');
        }
    }, []);
}