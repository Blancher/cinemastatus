import {useState} from 'react';

export default function useHttp() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const sendRequest = async(path, method = 'GET', body = null, headers = {}) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${path}`, {method, body, headers});
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setIsLoading(false);
            return data;
        } catch(err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    };

    return [error, isLoading, sendRequest];
}