'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { countries } from '../constants/countries'
import { getPhoneFormat } from '../constants/phoneFormats'
import { Country } from '../types'

interface CountryCodeSelectorProps {
  value: string
  phoneValue: string
  onChange: (countryCode: string) => void
  onPhoneChange: (phone: string) => void
}

const CountryCodeSelector: React.FC<CountryCodeSelectorProps> = ({
  value,
  phoneValue,
  onChange,
  onPhoneChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedCountry = useMemo(() => {
    return countries.find(c => c.code === value) || countries.find(c => c.code === '+358')
  }, [value])

  const filteredCountries = useMemo(() => {
    if (!search) return countries
    const searchLower = search.toLowerCase()
    return countries.filter(
      country =>
        country.name.toLowerCase().includes(searchLower) ||
        country.code.includes(search)
    )
  }, [search])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
        setSearch('')
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleCountrySelect = (countryCode: string) => {
    onChange(countryCode)
    onPhoneChange('')
    setIsDropdownOpen(false)
    setSearch('')
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const phoneFormat = getPhoneFormat(value)
    const digitsOnly = inputValue.replace(/\D/g, '')
    
    if (digitsOnly.length <= phoneFormat.maxLength) {
      onPhoneChange(inputValue)
    }
  }

  return (
    <div className="relative w-full h-12 bg-white rounded-[5px] border-2 flex items-center">
      {/* Custom Country Dropdown */}
      <div ref={dropdownRef} className="relative h-full flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            setIsDropdownOpen(!isDropdownOpen)
            setSearch('')
          }}
          className="h-full bg-transparent border-none pl-[18px] pr-[8px] text-lg font-manrope-normal text-zinc-950 outline-none cursor-pointer flex items-center gap-2 min-w-[120px]"
        >
          <span className="text-xl">{selectedCountry?.flag}</span>
          <span>{selectedCountry?.code}</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 20 20"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border-2 border-gray-200 rounded-[5px] shadow-lg z-50 w-[320px] max-h-[400px] overflow-hidden flex flex-col">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full h-10 px-3 border-2 border-gray-300 rounded-[5px] text-lg font-manrope-normal text-zinc-950 outline-none focus:border-[#5799FF] placeholder-zinc-950/40"
                autoFocus
              />
            </div>

            {/* Countries List */}
            <div className="overflow-y-auto max-h-[340px]">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => (
                  <button
                    key={`${country.code}-${country.name}-${index}`}
                    type="button"
                    onClick={() => handleCountrySelect(country.code)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      value === country.code ? 'bg-[#5799FF]/10' : ''
                    }`}
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span className="flex-1 text-lg font-manrope-normal text-zinc-950">{country.name}</span>
                    <span className="text-lg font-manrope-normal text-zinc-950/60">{country.code}</span>
                    {value === country.code && (
                      <svg className="w-5 h-5 text-[#5799FF]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-zinc-950/60 font-manrope-normal">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <input
        type="tel"
        name="phone"
        value={phoneValue}
        onChange={handlePhoneChange}
        placeholder={getPhoneFormat(value).placeholder}
        maxLength={getPhoneFormat(value).maxLength + 6}
        className="flex-1 h-full bg-transparent border-none pl-[8px] pr-[18px] text-lg font-manrope-normal text-zinc-950 outline-none placeholder-zinc-950/40"
      />
    </div>
  )
}

export default CountryCodeSelector

