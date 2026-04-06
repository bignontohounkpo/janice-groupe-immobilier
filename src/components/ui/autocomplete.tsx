"use client"

import { useState, useRef, useEffect, KeyboardEvent } from "react"
import { Search, X } from "lucide-react"

interface AutocompleteProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel?: string
  className?: string
  noResultsMessage?: string
  allowFreeText?: boolean
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Rechercher...",
  ariaLabel = "Recherche",
  className = "",
  noResultsMessage = "Aucun résultat trouvé",
  allowFreeText = false
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Filtrer les options
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  )

  // Sync avec la valeur externe
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Fermer si clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        listRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    setIsOpen(true)
    setHighlightedIndex(-1)
  }

  const handleSelectOption = (option: string) => {
    setInputValue(option)
    onChange(option)
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.blur()
  }

  const handleClear = () => {
    setInputValue("")
    onChange("")
    inputRef.current?.focus()
  }

  const handleBlur = () => {
    // Accepter la valeur saisie librement si allowFreeText est activé
    if (allowFreeText && inputValue && inputValue !== value) {
      onChange(inputValue)
    }
    setTimeout(() => setIsOpen(false), 150)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredOptions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0))
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0) {
          handleSelectOption(filteredOptions[highlightedIndex])
        } else if (filteredOptions.length > 0) {
          handleSelectOption(filteredOptions[0])
        }
        break
      case "Escape":
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const showSuggestions = isOpen && filteredOptions.length > 0
  const showNoResults = isOpen && inputValue && filteredOptions.length === 0

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-activedescendant={highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined}
          className="w-full py-2.5 px-3 pr-20 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Effacer"
              className="p-1 rounded-md hover:bg-muted transition-colors"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
          <Search size={18} className="text-muted-foreground" aria-hidden="true" />
        </div>
      </div>

      {showSuggestions && (
        <ul
          ref={listRef}
          id="suggestions-list"
          role="listbox"
          className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-xl border border-input bg-card shadow-lg"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={highlightedIndex === index}
              onClick={() => handleSelectOption(option)}
              className={`px-3 py-2 cursor-pointer text-sm transition-colors ${
                highlightedIndex === index
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      {showNoResults && (
        <div
          className="absolute z-50 w-full mt-1 px-3 py-2 rounded-xl border border-input bg-card shadow-lg text-sm text-muted-foreground text-center"
        >
          {noResultsMessage}
        </div>
      )}
    </div>
  )
}
