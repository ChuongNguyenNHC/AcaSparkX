import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';

const ImageWithFallback = ({ src, alt, style, className, fallbackSrc }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc || null);
        }
        setIsLoading(false);
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    // Update internal state if prop changes
    React.useEffect(() => {
        setImgSrc(src);
        setHasError(false);
        setIsLoading(true);
    }, [src]);

    if (hasError && !fallbackSrc) {
        return (
            <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0', color: '#94a3b8' }} className={className}>
                <FaImage style={{ fontSize: '1.5em' }} />
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', ...style }} className={className}>
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                }}>
                    <span style={{ width: '20px', height: '20px', border: '2px solid #cbd5e1', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            )}
            <img
                src={imgSrc}
                alt={alt}
                onError={handleError}
                onLoad={handleLoad}
                style={{ ...style, display: hasError ? 'none' : 'block' }} // Hide original if error to show fallback (if generic div fallback used) but here we swap src
            />
            {/* If we swapped src, the img tag above handles it. But if no fallbackSrc provided, we returned early. */}
        </div>
    );
};

export default ImageWithFallback;
