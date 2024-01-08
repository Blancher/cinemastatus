import {createContext, useState} from 'react';

export const context = createContext({isLoggedIn: false, token: null, userId: null, image: null, login() {}, logout() {}});

export function ContextProvider(props) {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [image, setImage] = useState(null);

    const login = (token, userId, image) => {
        setToken(token);
        setUserId(userId);
        setImage(image);
    };
    const logout = () => {
        setToken(null);
        setUserId(null);
        setImage(null);
    };
    
    return (
        <context.Provider value={{isLoggedIn: !!token, token, userId, image, login, logout}}>
            {props.children}
        </context.Provider>
    );
}