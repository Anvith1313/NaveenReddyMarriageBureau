"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface EmailClientCardProps {
  className?: string;
  avatarSrc: string;
  avatarFallback: string;
  senderName: string;
  senderRole?: string;
  timestamp: string;
  message: string;
  replyPlaceholder?: string;
  actions?: React.ReactNode[];
  onReplyClick?: (value: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, duration: 0.5, ease: 'easeOut' as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

function EmailClientCard({
  className,
  avatarSrc,
  avatarFallback,
  senderName,
  senderRole,
  timestamp,
  message,
  replyPlaceholder = 'Write to the bureau…',
  actions = [],
  onReplyClick,
}: EmailClientCardProps) {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <motion.div
      className={cn('w-full max-w-xl mx-auto flex flex-col overflow-hidden', className)}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E7D9C8',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(123,30,60,0.07), 0 1px 6px rgba(123,30,60,0.04)',
      }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
        {/* Gold accent top rule */}
        <div
          style={{
            height: 2,
            background: 'linear-gradient(90deg, transparent, #C8A24A, transparent)',
          }}
        />

        {/* Header */}
        <motion.div
          variants={itemVariants}
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.875rem',
            borderBottom: '1px solid #E7D9C8',
          }}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Avatar className="w-11 h-11">
              <AvatarImage src={avatarSrc} alt={senderName} />
              <AvatarFallback
                style={{
                  background: 'rgba(123,30,60,0.08)',
                  color: '#7B1E3C',
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}
              >
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            {/* Online/available dot */}
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#22c55e',
                border: '2px solid #FFFFFF',
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontWeight: 600,
              fontSize: '0.95rem',
              color: '#3A2B23',
              lineHeight: 1.3,
            }}>
              {senderName}
            </p>
            {senderRole && (
              <p style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '0.72rem',
                color: '#C8A24A',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginTop: 2,
              }}>
                {senderRole}
              </p>
            )}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '0.7rem',
              color: '#6B5C52',
            }}>
              {timestamp}
            </span>
            {actions.map((action, i) => (
              <motion.div key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                {action}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Body */}
        <motion.div
          variants={itemVariants}
          style={{
            padding: '1.25rem 1.5rem',
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontSize: '1.1rem',
            fontStyle: 'italic',
            color: '#3A2B23',
            lineHeight: 1.85,
          }}
        >
          {message}
        </motion.div>

        {/* Reply footer */}
        <motion.div
          variants={itemVariants}
          style={{
            padding: '0.875rem 1.5rem',
            borderTop: '1px solid #E7D9C8',
            background: '#FFFDF8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <input
            type="text"
            placeholder={replyPlaceholder}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && inputValue.trim()) {
                onReplyClick?.(inputValue.trim());
                setInputValue('');
              }
            }}
            style={{
              flex: 1,
              background: '#FFFFFF',
              border: '1px solid #E7D9C8',
              borderRadius: 50,
              padding: '0.45rem 1rem',
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '0.84rem',
              color: '#3A2B23',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#7B1E3C')}
            onBlur={e => (e.currentTarget.style.borderColor = '#E7D9C8')}
          />
          <motion.button
            type="button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              if (inputValue.trim()) {
                onReplyClick?.(inputValue.trim());
                setInputValue('');
              }
            }}
            style={{
              background: '#7B1E3C',
              color: '#FFFDF8',
              border: 'none',
              borderRadius: 50,
              padding: '0.45rem 1.1rem',
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Send
          </motion.button>
        </motion.div>
      </motion.div>
    );
}

export { EmailClientCard };
