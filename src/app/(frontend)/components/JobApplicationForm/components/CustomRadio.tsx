'use client'

import React from 'react'

interface CustomRadioProps {
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  label: string
  required?: boolean
  className?: string
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  name,
  value,
  checked,
  onChange,
  label,
  required = false,
  className = '',
}) => {
  return (
    <div className={`w-28 h-12 flex items-center justify-start bg-white rounded-[5px] border-2 ${className}`}>
      <label className="flex items-center justify-center text-white cursor-pointer w-full">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange(e.target.value)}
          className="mr-[12px] ml-[17px] w-4 h-4"
          required={required}
        />
        <span className="text-lg font-manrope-normal text-zinc-950 leading-7">{label}</span>
      </label>
    </div>
  )
}

export default CustomRadio

