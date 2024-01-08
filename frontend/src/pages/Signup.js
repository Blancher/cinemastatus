import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import useInput from '../hooks/useInput';
import useImageUpload from '../hooks/useImageUpload';
import Input from '../components/Input';
import ImageUpload from '../components/ImageUpload';
import useHttp from '../hooks/useHttp';
import Loading from '../components/Loading';
import {context} from '../store/context';

export default function Signup() {
    const ctx = useContext(context);
    const navigate = useNavigate();
    const [error, isLoading, sendRequest] = useHttp();
    const [usernameInput, usernameValid, usernameInputClasses, handleUsernameChange, handleUsernameBlur, handleUsernameSubmit, usernameInvalid] = useInput(input => input.length > 0);
    const [file, previewUrl, fileValid, filePickerRef, handlePicked, handlePickImage, fileInvalid, fileInputClasses] = useImageUpload();
    const [emailInput, emailValid, emailInputClasses, handleEmailChange, handleEmailBlur, handleEmailSubmit, emailInvalid] = useInput(input => input.length > 0);
    const [passwordInput, passwordValid, passwordInputClasses, handlePasswordChange, handlePasswordBlur, handlePasswordSubmit, passwordInvalid] = useInput(input => input.length >= 8);
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        handleUsernameSubmit();
        handleEmailSubmit();
        handlePasswordSubmit();

        if (usernameValid && fileValid && emailValid && passwordValid) {
            const formData = new FormData();
            formData.append('username', usernameInput);
            formData.append('image', file);
            formData.append('email', emailInput);
            formData.append('password', passwordInput);

            try {
                const response = await sendRequest('user/signup', 'POST', formData);
                ctx.login(response.token, response.userId, response.image);
                navigate('/');
            } catch(err) {
                return;
            }
        }
    };

    return (
        <div className='animate'>
            <h1 className='page'>Signup</h1>
            {isLoading && <Loading/>}
            {error && typeof error === 'object' && error.map(error => <h2 className='center error'>{error}</h2>)}
            {error && typeof error === 'string' && <h2 className='center error'>{error}</h2>}
            <Input classes={usernameInputClasses} invalid={usernameInvalid} message={`Username can't be empty.`} inputType='text' placeholder='Username' value={usernameInput} onChange={handleUsernameChange} onBlur={handleUsernameBlur}/>
            <ImageUpload invalid={fileInvalid} classes={fileInputClasses} filePickerRef={filePickerRef} handlePicked={handlePicked} previewUrl={previewUrl} handlePickImage={handlePickImage} message='File is invalid'/>
            <Input classes={emailInputClasses} invalid={emailInvalid} message={`Email can't be empty.`} inputType='email' placeholder='Email' value={emailInput} onChange={handleEmailChange} onBlur={handleEmailBlur}/>
            <Input classes={passwordInputClasses} invalid={passwordInvalid} message='Password must be at least 8 characters.' inputType='password' placeholder='Password' value={passwordInput} onChange={handlePasswordChange} onBlur={handlePasswordBlur}/>
            <motion.button onClick={handleSubmit} whileHover={{scale: 1.1}} className='button'>Signup</motion.button>
        </div>
    );
}