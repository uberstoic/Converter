import { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './App.css';

function App() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [convertTo, setConvertTo] = useState<'png' | 'jpg' | null>(null);
    const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
            setConvertedImageUrl(null);
            setError(null);

            // Автоматически определяем, в какой формат конвертировать
            const fileType = file.type;
            if (fileType === 'image/jpeg') {
                setConvertTo('png');
            } else if (fileType === 'image/png') {
                setConvertTo('jpg');
            } else {
                setConvertTo(null); // Неподдерживаемый формат
                setError('Unsupported file type. Please upload a JPG or PNG.');
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: { 'image/jpeg': [], 'image/png': [] },
        multiple: false 
    });

    const handleConvert = async () => {
        if (!selectedFile) {
            setError('Please select a file first.');
            return;
        }

        if (!convertTo) {
            setError('Unsupported file type. Please upload a JPG or PNG.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('convertTo', convertTo);

        setIsLoading(true);
        setError(null);
        setConvertedImageUrl(null);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await axios.post(`${apiUrl}/convert`, formData, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            setConvertedImageUrl(url);
        } catch (err) {
            setError('An error occurred during conversion.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Image Converter</h1>
                <p>Convert JPG to PNG and vice versa with ease.</p>
            </header>
            <main>
                <div className="converter-container">
                    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                        <input {...getInputProps()} />
                        {
                            selectedFile ?
                                <p>Selected: {selectedFile.name}</p> :
                                <p>Drag 'n' drop an image here, or click to select one</p>
                        }
                    </div>

                    {selectedFile && convertTo && (
                        <div className="controls">
                            <button onClick={handleConvert} disabled={isLoading} className="convert-button">
                                {isLoading ? 'Converting...' : `Convert to ${convertTo.toUpperCase()}`}
                            </button>
                        </div>
                    )}

                    {error && <p className="error-message">{error}</p>}

                    {convertedImageUrl && (
                        <div className="result">
                            <h2>Conversion Successful!</h2>
                            <img src={convertedImageUrl} alt="Converted result" className="preview-image" />
                            <a href={convertedImageUrl} download={`converted-image.${convertTo}`} className="download-link">
                                Download Image
                            </a>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
