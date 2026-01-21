import React from 'react';
import { TileStatus } from '../types';

/* =========================
   Types
========================= */

type KeyVariant = 'letter' | 'absent' | 'triangle' | 'circle' | 'action';

interface KeyboardProps {
    onKeyPress: (key: string) => void;
    keyStatuses: Record<string, TileStatus>;
}

/* =========================
   Layout constants
========================= */

const MAX_WIDTH = 520;

const LETTER_KEY = 'w-[44px] h-[52px]';
const CLUE_KEY = 'w-[44px] h-[44px]';
const ACTION_KEY = 'w-[64px] h-[44px]';
const CENTER_KEY = 'w-[56px] h-[44px]';

/* =========================
   Keyboard
========================= */

export const Keyboard: React.FC<KeyboardProps> = ({
    onKeyPress,
    keyStatuses,
}) => {
    const row1 = 'QWERTYUIOP'.split('');
    const row2 = 'ASDFGHJKL'.split('');
    const row3 = 'ZXCVBNM'.split('');

    const getVariant = (char: string): KeyVariant => {
        const status = keyStatuses[char];
        if (status === 'correct') return 'circle';
        if (status === 'present') return 'triangle';
        if (status === 'absent') return 'absent';
        return 'letter';
    };

    return (
        <div
            className="mx-auto select-none border-t border-white/10"
            style={{ maxWidth: MAX_WIDTH }}
        >
            {/* LETTER ROWS */}
            <Row>
                {row1.map((c) => (
                    <Key
                        key={c}
                        label={c}
                        variant={getVariant(c)}
                        onClick={() => onKeyPress(c)}
                    />
                ))}
            </Row>

            <Row>
                {row2.map((c) => (
                    <Key
                        key={c}
                        label={c}
                        variant={getVariant(c)}
                        onClick={() => onKeyPress(c)}
                    />
                ))}
            </Row>

            <Row>
                {row3.map((c) => (
                    <Key
                        key={c}
                        label={c}
                        variant={getVariant(c)}
                        onClick={() => onKeyPress(c)}
                    />
                ))}
            </Row>

            {/* BOTTOM ROW */}
            <div className="flex justify-center gap-2 mt-1 mb-2">
                {/* BACKSPACE */}
                <button
                    onClick={() => onKeyPress('BACKSPACE')}
                    className={`
            ${ACTION_KEY}
            rounded-md
            bg-gradient-to-b from-[#5A2A2A] to-[#3A1A1A]
            border border-white/15
            flex items-center justify-center
            transition-all
            active:scale-95
            hover:brightness-110
          `}
                >
                    <BackspaceIcon />
                </button>

                {/* CENTER VISUAL PLACEHOLDER */}
                <div
                    className={`
            ${CENTER_KEY}
            rounded-md
            bg-white/5
            border border-white/10
            flex flex-col items-center justify-center
            text-white/60
            pointer-events-none
          `}
                >
                    <span className="text-[10px] tracking-wide">VIZ</span>
                    <span className="text-sm leading-none">—</span>
                </div>

                {/* ENTER */}
                <button
                    onClick={() => onKeyPress('ENTER')}
                    className={`
            ${ACTION_KEY}
            rounded-md
            bg-gradient-to-b from-[#2E7D32] to-[#1B5E20]
            border border-white/15
            flex items-center justify-center
            transition-all
            active:scale-95
            hover:brightness-110
          `}
                >
                    <EnterIcon />
                </button>
            </div>
        </div>
    );
};

/* =========================
   Row wrapper
========================= */

const Row = ({ children }: { children: React.ReactNode }) => (
    <div className="flex justify-center gap-2 mb-2">{children}</div>
);

/* =========================
   Key component
========================= */

const Key = ({
    label,
    variant,
    onClick,
}: {
    label: string;
    variant: KeyVariant;
    onClick: () => void;
}) => {
    const variantClass = (() => {
        switch (variant) {
            case 'circle':
                return `
          ${CLUE_KEY}
          rounded-full
          bg-[#2196F3]
          shadow-[0_0_14px_rgba(33,150,243,0.7)]
        `;
            case 'triangle':
                return `
          ${CLUE_KEY}
          bg-[#FFC72C]
          clip-triangle
          shadow-[0_0_14px_rgba(255,199,44,0.7)]
        `;
            case 'absent':
                return `
          ${LETTER_KEY}
          rounded-md
          bg-[#1A1A1A]
          border border-white/10
          text-white/50
        `;
            default:
                return `
          ${LETTER_KEY}
          rounded-md
          bg-gradient-to-b from-[#5A5A5A] to-[#4A4A4A]
          border border-white/20
        `;
        }
    })();

    return (
        <button
            onClick={onClick}
            className={`
        flex items-center justify-center
        font-bold text-lg
        text-white
        transition-all
        active:scale-95
        hover:brightness-110
        ${variantClass}
      `}
        >
            {label}
        </button>
    );
};

/* =========================
   Icons
========================= */

const BackspaceIcon = () => (
    <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-9.172a2 2 0 00-1.414.586L3 12z"
        />
    </svg>
);

const EnterIcon = () => (
    <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 11l3-3m0 0l3 3m-3-3v8"
        />
    </svg>
);

/* =========================
   CSS (once, globally)
========================= */
/*
.clip-triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}
*/
