import React, { useState } from 'react';
import { clsx } from 'clsx';

interface AmenityPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
  suggestions: string[];
}

export const AmenityPicker = ({ value, onChange, suggestions }: AmenityPickerProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
  );

  const toggleAmenity = (amenity: string) => {
    if (value.includes(amenity)) {
      onChange(value.filter(a => a !== amenity));
    } else {
      onChange([...value, amenity]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      if (!value.includes(inputValue)) {
        onChange([...value, inputValue]);
      }
      setInputValue('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className={clsx(
          "min-h-[56px] w-full bg-[#f6f3ee] dark:bg-[#1c1b1b] border-outline-variant/20 p-2 flex flex-wrap gap-2 transition-all",
          isFocused ? "ring-1 ring-secondary border-secondary" : "border"
        )}>
          {value.map((amenity) => (
            <span 
              key={amenity} 
              className="bg-primary text-white text-[10px] uppercase tracking-widest px-3 py-1.5 flex items-center gap-2"
            >
              {amenity}
              <button 
                type="button" 
                onClick={() => toggleAmenity(amenity)}
                className="hover:text-secondary"
              >
                <span className="material-symbols-outlined notranslate text-xs" translate="no">close</span>
              </button>
            </span>
          ))}
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={value.length === 0 ? "Search or add amenities..." : ""}
            className="flex-grow bg-transparent border-none focus:ring-0 text-sm py-2 px-3"
          />
        </div>

        {isFocused && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-[#1c1b1b] border border-outline-variant/20 shadow-2xl max-h-60 overflow-y-auto">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  toggleAmenity(suggestion);
                  setInputValue('');
                }}
                className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-[#f6f3ee] dark:hover:bg-[#2a2a2a] transition-colors border-b border-outline-variant/10 last:border-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <p className="w-full text-[9px] uppercase tracking-widest text-outline opacity-50 mb-1">Common Suggestions</p>
        {suggestions.slice(0, 8).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => toggleAmenity(s)}
            className={clsx(
              "text-[9px] uppercase tracking-widest px-3 py-1 border transition-all",
              value.includes(s) 
                ? "bg-secondary/10 border-secondary text-secondary" 
                : "border-outline-variant/20 text-outline hover:border-secondary"
            )}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};
