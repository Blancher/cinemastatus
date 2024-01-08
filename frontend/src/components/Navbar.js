import {useState, useContext} from 'react';
import {NavLink, Link, useNavigate} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
import {context} from '../store/context';

export default function Navbar() {
    const ctx = useContext(context);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleRedirect = () => navigate('/user-rankings');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navlinks = (
        <>
            <NavLink end to='/' className={({isActive}) => isActive ? 'navlink active' : 'navlink'}>Rankings</NavLink>
            {!ctx.isLoggedIn && (
                <>
                    <NavLink to='/login' className={({isActive}) => isActive ? 'navlink active' : 'navlink'}>Login</NavLink>
                    <NavLink to='/signup' className={({isActive}) => isActive ? 'navlink active' : 'navlink'}>Signup</NavLink>
                </>
            )}
            {ctx.isLoggedIn && (
                <>
                    <NavLink to='/choose-series' className={({isActive}) => isActive ? 'navlink active' : 'navlink'}>New Ranking</NavLink>
                    <Link onClick={ctx.logout} className='navlink' to='/'>Logout</Link>
                    <img onClick={handleRedirect} width='45' height='45' src={`${process.env.REACT_APP_BACKEND_URL}/${ctx.image}`} className='pointer' id='profile'/>
                </>
            )}
        </>
    );
    
    return (
        <header display='flex'>
            <div id='nav1'>
                <h1 id='header'>CinemaStatus</h1>
                <div className='flex'>
                    {navlinks}
                </div>
            </div>
            <div id='nav2'>
                <img onClick={handleOpen} className='pointer' width='50' height='50' src='https://icon-library.com/images/menu-icon-png-3-lines/menu-icon-png-3-lines-3.jpg'/>
                <h1 id='header'>CinemaStatus</h1>
                <AnimatePresence>
                    {open && <motion.div initial={{opacity: 0}} animate={{opacity: .5}} exit={{opacity: 0}} onClick={handleClose} className='background'></motion.div>}
                </AnimatePresence>
                <AnimatePresence>
                    {open && (
                        <motion.div onClick={handleClose} className='flex' id='sidebar' initial={{x: '-500%'}} animate={{x: 0}} exit={{x: '-500%'}} transition={{duration: '.2'}}>
                            {navlinks}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}