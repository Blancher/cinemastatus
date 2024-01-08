import {useRef, useState, useEffect} from "react";

export default function useImageUpload() {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [valid, setValid] = useState(false);
    const [touched, setTouched] = useState(false);
    const filePickerRef = useRef();
    const invalid = !valid && touched;
    const inputClasses = invalid ? 'invalid' : '';

    useEffect(() => {
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = () => setPreviewUrl(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    }, [file]);

    const handlePicked = e => {
        setTouched(true);
        
        if (e.target.files && e.target.files.length === 1) {
            const pickedFile = e.target.files[0];
            setFile(pickedFile);
            setValid(true);
        } else {
            setValid(false);
        }
    };
    const handlePickImage = () => filePickerRef.current.click();

    return [file, previewUrl, valid, filePickerRef, handlePicked, handlePickImage, invalid, inputClasses];
}