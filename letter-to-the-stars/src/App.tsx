import { useEffect, useRef, useState } from 'react';
import './App.css';
import StarModal from './components/StarModal';
import LetterModal from './components/LetterModal';
import { getLetters } from './lib/letters';
import type { Star } from './types/star';

export default function App() {
  const [stars, setStars] = useState<Star[]>([]);
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null);

  const [previewPosition, setPreviewPosition] = useState({
    left: 0,
    top: 0,
  });

  const previewRef = useRef<HTMLDivElement>(null);
  const hoveredStarRef = useRef<HTMLDivElement>(null);

  const handleStarHover = (
    star: Star,
    element: HTMLDivElement
  ) => {
    setHoveredStar(star);
    hoveredStarRef.current = element;

    const rect = element.getBoundingClientRect();

    const gap = 14;
    const cardWidth = 190;

    // Estimate the card height for the initial calculation.
    // The actual height will be corrected after rendering.
    const cardHeight = 75;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Start by placing the card above the star.
    let left = rect.left + rect.width / 2 - cardWidth / 2;
    let top = rect.top - cardHeight - gap;

    // If there isn't enough room above,
    // place it underneath instead.
    if (top < 8) {
      top = rect.bottom + gap;
    }

    // Keep the card inside the left/right edges.
    left = Math.max(
      8,
      Math.min(left, viewportWidth - cardWidth - 8)
    );

    // If the card still doesn't fit vertically,
    // clamp it inside the viewport.
    top = Math.max(
      8,
      Math.min(top, viewportHeight - cardHeight - 8)
    );

    setPreviewPosition({
      left,
      top,
    });
  };

  useEffect(() => {
    if (!hoveredStar || !previewRef.current || !hoveredStarRef.current) {
      return;
    }

    const card = previewRef.current;
    const star = hoveredStarRef.current;

    const starRect = star.getBoundingClientRect();
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;

    const gap = 14;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Try placing the card above the star first.
    let top = starRect.top - cardHeight - gap;

    // If there isn't enough room above,
    // place it below the star.
    if (top < 8) {
      top = starRect.bottom + gap;
    }

    // Center the card horizontally around the star.
    let left =
      starRect.left +
      starRect.width / 2 -
      cardWidth / 2;

    // Keep the card inside the viewport horizontally.
    left = Math.max(
      8,
      Math.min(left, viewportWidth - cardWidth - 8)
    );

    // Keep it inside the viewport vertically.
    top = Math.max(
      8,
      Math.min(top, viewportHeight - cardHeight - 8)
    );

    setPreviewPosition({
      left,
      top,
    });
  }, [hoveredStar]);

  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (
        event.key === 'Enter' &&
        !isLetterModalOpen &&
        !isTyping
      ) {
        event.preventDefault();
        setIsLetterModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLetterModalOpen]);

  const handleLetterCreated = (newStar: Star) => {
    setStars((currentStars) => [...currentStars, newStar]);
  };

  useEffect(() => {
    getLetters()
      .then((data) => {
        if (data) {
          // Normalize Supabase snake_case data if needed
          const formattedStars: Star[] = data.map((item: any) => ({
            id: item.id,
            message: item.message,
            createdAt: item.createdAt ?? item.created_at ?? new Date().toISOString(),
            x: item.x ?? Math.random() * 90 + 5,
            y: item.y ?? Math.random() * 90 + 5,
            size: item.size ?? 6,
            brightness: item.brightness ?? 1,
            shape: item.shape ?? 'circle',
          }));

          setStars(formattedStars);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch letters:', error);
      });
  }, []);

  return (
    <div className="sky">

      <button
        className="write-letter-button"
        onClick={() => setIsLetterModalOpen(true)}
      >
        Write a letter ✦
      </button>

      {stars.map((star) => (
        <div
          key={star.id}
          className="star-wrapper"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          onMouseEnter={(event) => {
            handleStarHover(star, event.currentTarget);
          }}
          onMouseLeave={() => {
            setHoveredStar(null);
          }}
          onClick={() => setSelectedStar(star)}
        >
          <div
            className={`star star-${star.shape}`}
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.brightness,
            }}
          />
        </div>
      ))}

      {hoveredStar && (
        <div
          ref={previewRef}
          className="star-preview"
          style={{
            left: `${previewPosition.left}px`,
            top: `${previewPosition.top}px`,
          }}
        >
          <p className="preview-text">
            {hoveredStar.message && hoveredStar.message.length > 60
              ? `${hoveredStar.message.slice(0, 60)}…`
              : hoveredStar.message}
          </p>

          <span className="preview-hint">
            Click to open
          </span>
        </div>
      )}

      <StarModal
        star={selectedStar}
        onClose={() => setSelectedStar(null)}
      />

      <LetterModal
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        onLetterCreated={handleLetterCreated}
      />
    </div>
  );
}