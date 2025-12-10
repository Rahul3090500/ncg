import React from 'react';

interface RealEstateIconProps {
  className?: string;
  width?: number;
  height?: number;
}

const RealEstateIcon: React.FC<RealEstateIconProps> = ({ 
  className = "", 
  width = 17, 
  height = 17 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 17 17" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12.999 16.0039V9.29395L11.707 8.00195H10.9985V4.00098H9.99829V2.29224L8.99805 1.292V0H8.00195V1.292L7.00171 2.29224V4.00098H6.00146V6.00146H5.29298L4.00098 7.29347V16.0039H0V17H17V16.0039H12.999ZM11.2944 8.99805L12.0029 9.70654V16.0039H10.9985V8.99805H11.2944ZM7.9978 2.70483L8.5 2.20263L9.0022 2.70483V4.00098H7.9978V2.70483ZM7.00171 4.99707H9.99829H10.0024V16.0039H6.99756V4.99707H7.00171ZM4.99707 7.70605L5.70556 6.99756H6.00146V16.0039H4.99707V7.70605Z" fill="black"/>
      <path d="M8.00195 6.00146H8.99805V6.99756H8.00195V6.00146Z" fill="black"/>
      <path d="M8.00195 8.00133H8.99805V8.99742H8.00195V8.00133Z" fill="black"/>
      <path d="M8.00195 10.0014H8.99805V10.9975H8.00195V10.0014Z" fill="black"/>
      <path d="M8.00195 12.0013H8.99805V12.9974H8.00195V12.0013Z" fill="black"/>
      <path d="M8.00195 14.0013H8.99805V14.9974H8.00195V14.0013Z" fill="black"/>
    </svg>
  );
};

export default RealEstateIcon;