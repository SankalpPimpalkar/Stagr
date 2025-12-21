import { useState } from "react";

export function ImageCarousel({ images, altPrefix = "Image" }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    if (images.length === 1) {
        return (
            <div className="w-full h-full">
                <img
                    src={images[0]}
                    alt={`${altPrefix} 1`}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    const nextSlide = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToSlide = (index, e) => {
        if (e) e.stopPropagation();
        setCurrentIndex(index);
    };

    return (
        <div className="relative w-full h-full group">
            {/* Main Image */}
            <img
                src={images[currentIndex]}
                alt={`${altPrefix} ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 backdrop-blur-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 backdrop-blur-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => goToSlide(index, e)}
                        className={`w-2 h-2 rounded-full transition-all ${currentIndex === index
                                ? "bg-white scale-110"
                                : "bg-white/50 hover:bg-white/80"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
