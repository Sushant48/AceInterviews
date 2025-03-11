import { useState, useCallback } from 'react';

const useFormState = (initialState) => {
    const [state, setState] = useState(initialState);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);

    const handleFileChange = useCallback((e) => {
        setState(prevState => ({
            ...prevState,
            profilePic: e.target.files[0]
        }));
    }, []);

    return [state, handleChange, handleFileChange];
};

export default useFormState;
