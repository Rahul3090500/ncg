import React from 'react'
import Arrow from './arrow/Arrow'

interface ArrowIconProps {
  size?: number
  className?: string
  bgColor?: string
  iconColor?: string
  hoverOnParent?: boolean
}

const ArrowIcon: React.FC<ArrowIconProps> = ({
  size = 39,
  className = '',
  bgColor = '#488bf3',
  iconColor = 'white',
  hoverOnParent = false
}) => {
  return (
    <div 
      className={`arrow rounded-[5px] flex justify-center items-center ${className}`}
      style={{
        backgroundColor: bgColor,
        width: `${size}px`,
        height: `${size}px`
      }}
    >
      <Arrow stroke={iconColor} hoverOnParent={hoverOnParent} />
    </div>
  )
}

export default ArrowIcon