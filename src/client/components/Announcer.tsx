import React from 'react';

interface AnnouncerProps {
    message: string;
}

/**
 * Accessibility announcer component.
 * Renders an off-screen aria-live region for screen reader announcements.
 */
export const Announcer: React.FC<AnnouncerProps> = ({ message }) => {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
            }}
        >
            {message}
        </div>
    );
};
