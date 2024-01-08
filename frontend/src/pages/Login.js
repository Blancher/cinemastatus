import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import useInput from '../hooks/useInput';
import Input from '../components/Input';
import Loading from '../components/Loading';
import useHttp from '../hooks/useHttp';
import {context} from '../store/context';

export default function Login() {
    const ctx = useContext(context);
    const navigate = useNavigate();
    const [error, isLoading, sendRequest] = useHttp();
    const [emailInput, emailValid, emailInputClasses, handleEmailChange, handleEmailBlur, handleEmailSubmit, emailInvalid] = useInput(input => true);
    const [passwordInput, passwordValid, passwordInputClasses, handlePasswordChange, handlePasswordBlur, handlePasswordSubmit, passwordInvalid] = useInput(input => true);
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if (emailValid && passwordValid) {
            try {
                const response = await sendRequest('user/login', 'POST', JSON.stringify({email: emailInput, password: passwordInput}), {'Content-Type': 'application/json'});
                ctx.login(response.token, response.userId, response.image);
                navigate('/');
            } catch(err) {
                return;
            }
        }
    };

    return (
        <div className='animate'>
            <h1 className='page'>Login</h1>
            {isLoading && <Loading/>}
            {error && <h2 className='center error'>{error}</h2>}
            <form noValidate onSubmit={handleSubmit}>
                <Input classes={emailInputClasses} invalid={emailInvalid} inputType='email' placeholder='Email' value={emailInput} onChange={handleEmailChange} onBlur={handleEmailBlur}/>
                <Input classes={passwordInputClasses} invalid={passwordInvalid} inputType='password' placeholder='Password' value={passwordInput} onChange={handlePasswordChange} onBlur={handlePasswordBlur}/>
                <motion.button whileHover={{scale: 1.1}} className='button'>Login</motion.button>
            </form>
        </div>
    );
}