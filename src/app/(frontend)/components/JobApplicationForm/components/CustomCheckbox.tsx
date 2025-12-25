'use client'

import React, { useRef, useEffect } from 'react'

interface CustomCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  name?: string
  required?: boolean
  className?: string
  labelClassName?: string
  children?: React.ReactNode
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  label,
  name,
  required = false,
  className = '',
  labelClassName = '',
  children,
}) => {
  const labelRef = useRef<HTMLLabelElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const labelElement = labelRef.current
    if (!labelElement) return

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // If clicking on a link, prevent the label from activating the input
      if (target.tagName === 'A' || target.closest('a')) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    // Use capture phase to intercept before label's default behavior
    labelElement.addEventListener('mousedown', handleMouseDown, true)
    return () => {
      labelElement.removeEventListener('mousedown', handleMouseDown, true)
    }
  }, [])

  return (
    <label 
      ref={labelRef}
      className={`flex items-center cursor-pointer ${className}`}
    >
      <div className="mr-3 relative flex-shrink-0">
        <input
          ref={inputRef}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          className="hidden"
        />
        <div
          className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center pointer-events-none ${
            checked
              ? 'bg-[#5799FF] border-[#5799FF]'
              : 'bg-white border-gray-300'
          }`}
        >
          {checked && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16">
              <path d="M13.5 4L6 11.5L2.5 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
      {children ? (
        <span className={labelClassName}>{children}</span>
      ) : label ? (
        <span className={labelClassName}>{label}</span>
      ) : null}
    </label>
  )
}

export default CustomCheckbox

