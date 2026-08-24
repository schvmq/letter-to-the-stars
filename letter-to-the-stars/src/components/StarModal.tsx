import type { Star } from '../types/star';
import './StarModal.css';

interface StarModalProps {
    star: Star | null;
    onClose: () => void;
}

export default function StarModal({ star, onClose }: StarModalProps) {
    if (!star) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close letter">
                    ×
                </button>
                <div className="modal-body">
                    <p className="modal-message">{star.message}</p>
                    {star.createdAt && (
                        <span className="modal-date">
                            Written on {new Date(star.createdAt).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}