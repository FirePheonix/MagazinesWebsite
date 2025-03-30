import React, { useState, useEffect, useRef, useCallback } from 'react';
import './PremiumSlider.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlay, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface SlideData {
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  link: string;
  linkText: string;
  hasVideo?: boolean;
}

const PremiumSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const AUTOPLAY_DELAY = 6000;

  const sliderData: SlideData[] = [
    {
      category: 'FASHION',
      title: 'The New Silhouettes Defining Modern Elegance',
      excerpt: 'Explore how contemporary designers are reshaping traditional forms with bold architectural influences and sustainable materials.',
      author: 'Alexandra Chen',
      date: 'June 2023',
      image: '/images/fashion-1.jpg',
      link: '#',
      linkText: 'Read Feature'
    },
    {
      category: 'TRAVEL',
      title: 'Hidden Sanctuaries: Luxury Retreats Beyond the Beaten Path',
      excerpt: 'Discover exclusive destinations where privacy meets unparalleled natural beauty, offering a new perspective on luxury travel.',
      author: 'Marco Rossi',
      date: 'June 2023',
      image: '/images/travel-1.jpg',
      link: '#',
      linkText: 'Explore Destinations'
    },
    {
      category: 'CULINARY',
      title: 'The Art of Fermentation: Ancient Techniques Reimagined',
      excerpt: 'How leading chefs are reviving forgotten preservation methods to create bold new flavors and sustainable kitchen practices.',
      author: 'Olivia Kim',
      date: 'June 2023',
      image: '/images/culinary-1.jpg',
      link: '#',
      linkText: 'Watch Feature',
      hasVideo: true
    },
    {
      category: 'DESIGN',
      title: 'Living Minimalism: The New Wave of Conscious Design',
      excerpt: 'Exploring how architects and interior designers are creating spaces that balance aesthetic beauty with environmental responsibility.',
      author: 'David Nakamura',
      date: 'June 2023',
      image: '/images/design-1.jpg',
      link: '#',
      linkText: 'View Gallery'
    },
    {
      category: 'CULTURE',
      title: 'Digital Renaissance: When Technology Meets Classical Art',
      excerpt: 'How emerging artists are using AI and digital tools to reinterpret masterpieces and create entirely new forms of artistic expression.',
      author: 'Sophia Williams',
      date: 'June 2023',
      image: '/images/culture-1.jpg',
      link: '#',
      linkText: 'Explore Exhibition'
    }
  ];

  const startProgressBar = useCallback(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.transition = `width ${AUTOPLAY_DELAY}ms linear`;
      progressBarRef.current.style.width = '100%';
    }
  }, []);

  const resetProgressBar = useCallback(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.transition = 'none';
      progressBarRef.current.style.width = '0';
      void progressBarRef.current.offsetWidth;
      startProgressBar();
    }
  }, [startProgressBar]);

  const pauseProgressBar = useCallback(() => {
    if (progressBarRef.current) {
      const computedStyle = window.getComputedStyle(progressBarRef.current);
      const width = computedStyle.getPropertyValue('width');
      progressBarRef.current.style.transition = 'none';
      progressBarRef.current.style.width = width;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    autoplayIntervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % sliderData.length);
    }, AUTOPLAY_DELAY);
    startProgressBar();
  }, [startProgressBar]);

  const resetAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }
    startAutoplay();
    resetProgressBar();
  }, [startAutoplay, resetProgressBar]);

  const pauseAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }
    pauseProgressBar();
  }, [pauseProgressBar]);

  const goToSlide = useCallback((index: number) => {
    if (!animating) {
      setCurrentIndex(index);
      resetAutoplay();
    }
  }, [animating, resetAutoplay]);

  const handlePrevSlide = useCallback(() => {
    if (!animating) {
      setCurrentIndex(prev => (prev - 1 + sliderData.length) % sliderData.length);
      resetAutoplay();
    }
  }, [animating, resetAutoplay]);

  const handleNextSlide = useCallback(() => {
    if (!animating) {
      setCurrentIndex(prev => (prev + 1) % sliderData.length);
      resetAutoplay();
    }
  }, [animating, resetAutoplay]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, [startAutoplay]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAutoplay();
      } else {
        startAutoplay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pauseAutoplay, startAutoplay]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePrevSlide, handleNextSlide]);

  return (
    <div className="magazine-wrapper">
      <header className="magazine-header">
        <div className="logo">ELITE</div>
        <div className="tagline">The Art of Modern Living</div>
      </header>

      <div className="premium-carousel">
        <div className="carousel-progress">
          <div className="progress-bar" ref={progressBarRef}></div>
        </div>

        <div className="carousel-container">
          <div
            className="carousel-track"
            ref={trackRef}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            onMouseEnter={pauseAutoplay}
            onMouseLeave={startAutoplay}
          >
            {sliderData.map((slide, index) => (
              <div key={index} className="carousel-item">
                <div className="item-content">
                  <div className={`item-image ${slide.hasVideo ? 'video-feature' : ''}`}>
                    <img src={slide.image} alt={slide.title} />
                    <div className="image-overlay"></div>
                    {slide.hasVideo && (
                      <div className="video-indicator">
                        <FontAwesomeIcon icon={faPlay} />
                      </div>
                    )}
                  </div>
                  <div className="item-text">
                    <div className="item-category">{slide.category}</div>
                    <h2 className={`item-title ${index === currentIndex ? 'slide-up' : ''}`}>
                      {slide.title}
                    </h2>
                    <p className={`item-excerpt ${index === currentIndex ? 'slide-up' : ''}`}>
                      {slide.excerpt}
                    </p>
                    <div className={`item-meta ${index === currentIndex ? 'fade-in' : ''}`}>
                      <span className="item-author">By {slide.author}</span>
                      <span className="item-date">{slide.date}</span>
                    </div>
                    <a href={slide.link} className={`read-more ${index === currentIndex ? 'fade-in' : ''}`}>
                      <span>{slide.linkText}</span>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="carousel-navigation">
            <button className="nav-button prev" onClick={handlePrevSlide} aria-label="Previous article">
              <div className="button-content">
                <FontAwesomeIcon icon={faChevronLeft} />
                <span className="nav-text">Previous</span>
              </div>
            </button>

            <div className="carousel-counter">
              <span className="current">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="separator">/</span>
              <span className="total">{String(sliderData.length).padStart(2, '0')}</span>
            </div>

            <button className="nav-button next" onClick={handleNextSlide} aria-label="Next article">
              <div className="button-content">
                <span className="nav-text">Next</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </button>
          </div>
        </div>

        <div className="thumbnail-navigation">
          {sliderData.map((_, index) => (
            <div
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            >
              <img src={sliderData[index].image} alt={`Thumbnail ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PremiumSlider;