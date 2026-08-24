import { useEffect, useRef, useState } from 'react'; import './LetterModal.css';
import { createLetter } from '../lib/letters';
import type { Star } from '../types/star';

type LetterModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onLetterCreated: (star: Star) => void;
};

export default function LetterModal({
    isOpen,
    onClose,
    onLetterCreated,
}: LetterModalProps) {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        textareaRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isSubmitting) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, isSubmitting]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            setError('Your letter needs a message.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const newLetter = await createLetter(trimmedMessage);

            console.log('Letter created:', newLetter);
            onLetterCreated(newLetter);

            setMessage('');
            onClose();
        } catch (error) {
            console.error('Failed to create letter:', error);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="letter-modal-backdrop" onClick={onClose}>
            <div
                className="letter-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    className="letter-modal-close"
                    onClick={onClose}
                    aria-label="Close letter modal"
                >
                    ×
                </button>

                <h2>Write to the Stars</h2>

                <p>
                    Leave a little piece of yourself somewhere in the night sky.
                </p>

                <textarea
                    ref={textareaRef}
                    className="letter-textarea"
                    placeholder="Dear stars..."
                    value={message}
                    onChange={(event) => {
                        setMessage(event.target.value);
                        setError('');
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            handleSubmit();
                        }
                    }}
                    maxLength={300}
                />

                <p
                    className={`character-count ${message.length >= 280 ? 'character-count-warning' : ''
                        }`}
                >
                    {message.length} / 300
                </p>

                {error && (
                    <p className="letter-error">
                        {error}
                    </p>
                )}

                <button
                    className="letter-submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Sending...' : 'Send to the stars ✦'}
                </button>

            </div>
        </div>
    );
}