'use client';

import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Send, Mic, MicOff, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  showAttachment?: boolean;
  showVoiceInput?: boolean;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "메시지를 입력하세요...",
  maxLength = 500,
  className,
  showAttachment = false,
  showVoiceInput = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 메시지 전송
  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    onSendMessage(trimmedMessage);
    setMessage('');
    
    // 높이 리셋
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message, disabled, onSendMessage]);

  // 키보드 이벤트 처리
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift + Enter: 새 줄
    // Enter: 전송
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // 텍스트 영역 자동 높이 조절
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // 최대 길이 체크
    if (value.length <= maxLength) {
      setMessage(value);
    }

    // 높이 자동 조절
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [maxLength]);

  // 음성 입력 토글
  const toggleVoiceInput = useCallback(() => {
    setIsVoiceActive(!isVoiceActive);
    // TODO: 음성 인식 로직 구현
  }, [isVoiceActive]);

  // 첨부파일 처리
  const handleAttachment = useCallback(() => {
    // TODO: 파일 첨부 로직 구현
  }, []);

  const isMessageValid = message.trim().length > 0;
  const remainingChars = maxLength - message.length;

  return (
    <div className={cn("w-full", className)}>
      {/* 입력 컨테이너 */}
      <div
        className={cn(
          "relative flex items-end gap-2 p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border transition-all duration-200",
          isFocused 
            ? "border-orange-500 shadow-orange-500/20" 
            : "border-gray-200 dark:border-gray-700",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* 첨부파일 버튼 */}
        {showAttachment && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAttachment}
            disabled={disabled}
            className="flex-shrink-0 p-2 text-gray-500 hover:text-orange-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="파일 첨부"
          >
            <Paperclip className="w-5 h-5" />
          </motion.button>
        )}

        {/* 텍스트 입력 영역 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              "w-full resize-none bg-transparent border-0 outline-0 text-sm leading-6 placeholder-gray-500 dark:placeholder-gray-400",
              "min-h-[24px] max-h-[120px] py-1",
              disabled && "cursor-not-allowed"
            )}
            style={{ scrollbarWidth: 'thin' }}
          />

          {/* 문자 수 표시 */}
          <AnimatePresence>
            {(isFocused || message.length > maxLength * 0.8) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={cn(
                  "absolute right-2 bottom-1 text-xs transition-colors",
                  remainingChars < 50 
                    ? "text-red-500" 
                    : remainingChars < 100 
                    ? "text-amber-500" 
                    : "text-gray-400"
                )}
              >
                {remainingChars}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 음성 입력 버튼 */}
        {showVoiceInput && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleVoiceInput}
            disabled={disabled}
            className={cn(
              "flex-shrink-0 p-2 rounded-lg transition-colors",
              isVoiceActive
                ? "bg-red-500 text-white"
                : "text-gray-500 hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
            title="음성 입력"
          >
            {isVoiceActive ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </motion.button>
        )}

        {/* 전송 버튼 */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleSend}
            disabled={!isMessageValid || disabled}
            variant="gradient"
            size="sm"
            className="flex-shrink-0 h-10 w-10 p-0 rounded-xl"
            title="메시지 전송 (Enter)"
          >
            <Send className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      {/* 키보드 힌트 */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 px-3 text-xs text-gray-500 dark:text-gray-400"
          >
            <span className="inline-block mr-4">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Enter</kbd> 전송
            </span>
            <span className="inline-block">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Shift + Enter</kbd> 줄바꿈
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}