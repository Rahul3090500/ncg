'use client'

import React from 'react'

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
  return (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <div className="mr-3 relative flex-shrink-0">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          className="hidden"
        />
        <div
          className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center cursor-pointer ${
            checked
              ? 'bg-[#5799FF] border-[#5799FF]'
              : 'bg-white border-gray-300'
          }`}
          onClick={() => onChange(!checked)}
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

