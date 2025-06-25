import React, { useRef } from 'react';

interface OTPInputProps {
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}

export default function OTPInput({ onChange, onComplete }: OTPInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (/^[0-9a-zA-Z]$/.test(value)) {
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    reportCode();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('Text').trim().slice(0, 5);

    if (!/^[0-9a-zA-Z]+$/.test(pasteData)) return;

    pasteData.split('').forEach((char, i) => {
      const ref = inputRefs.current[i];
      if (ref) {
        ref.value = char;
      }
    });

    const lastRef = inputRefs.current[pasteData.length - 1];
    lastRef?.focus();

    reportCode();
  };

  const reportCode = () => {
    const code = inputRefs.current.map((ref) => ref?.value || '').join('');
    onChange?.(code);
    if (code.length === 5 && !code.includes(' ')) {
      onComplete?.(code);
    }
  };

  return (
    <div className="flex gap-3">
      {Array.from({ length: 5 }, (_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          className="input input-bordered w-12 h-12 text-center text-lg focus:outline-0 focus:border-2 focus:border-primary"
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
