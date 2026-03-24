"use client"

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from "react"
import { Search, X, Loader2 } from "lucide-react"

interface AutocompleteAsyncProps {
  searchFn: (query: string) => Promise<string[]>
  value: string
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel?: string
  className?: string
  noResultsMessage?: string
  debounceMs?: number
  searchOnFocus?: boolean
  initialQuery?: string
}

export function AutocompleteAsync({
  searchFn,
  value,
  onChange,
  placeholder = "Rechercher...",
  ariaLabel = "Recherche",
  className = "",
  noResultsMessage = "Aucun résultat trouvé",
  debounceMs = 300,
  searchOnFocus = false,
  initialQuery = ""
}: AutocompleteAsyncProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [options, setOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [hasSearchedOnFocus, setHasSearchedOnFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Sync avec la valeur externe
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Fetch avec debounce
  const performSearch = useCallback(
    async (query: string) => {
      setLoading(true)
      try {
        const results = await searchFn(query)
        setOptions(results)
      } catch {
        setOptions([])
      } finally {
        setLoading(false)
      }
    },
    [searchFn]
  )

  const debouncedSearch = useCallback(
    async (query: string) => {
      if (!query.trim() && !searchOnFocus) {
        setOptions([])
        return
      }
      await performSearch(query)
    },
    [performSearch, searchOnFocus]
  )

  // Reset focus search quand les dépendances changent
  useEffect(() => {
    setHasSearchedOnFocus(false)
  }, [initialQuery])

  useEffect(() => {
    const timeout = setTimeout(() => {
      debouncedSearch(inputValue)
    }, debounceMs)
    return () => clearTimeout(timeout)
  }, [inputValue, debouncedSearch, debounceMs])

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

  const handleFocus = async () => {
    setIsOpen(true)
    if (searchOnFocus && !hasSearchedOnFocus) {
      setHasSearchedOnFocus(true)
      await performSearch(initialQuery)
    }
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
    setOptions([])
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || options.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < options.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0))
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0) {
          handleSelectOption(options[highlightedIndex])
        } else if (options.length > 0) {
          handleSelectOption(options[0])
        }
        break
      case "Escape":
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const showSuggestions = isOpen && options.length > 0
  const showNoResults = isOpen && inputValue && !loading && options.length === 0

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={handleFocus}
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
          {loading ? (
            <Loader2 size={16} className="text-muted-foreground animate-spin" />
          ) : (
            <Search size={18} className="text-muted-foreground" aria-hidden="true" />
          )}
        </div>
      </div>

      {showSuggestions && (
        <ul
          ref={listRef}
          id="suggestions-list"
          role="listbox"
          className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-xl border border-input bg-card shadow-lg"
        >
          {options.map((option, index) => (
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
