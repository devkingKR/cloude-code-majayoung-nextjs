import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeConfig = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-16 h-16', text: 'text-3xl' },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${config.icon} relative`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          
          {/* 외부 원형 테두리 */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
          />
          
          {/* 내부 연결 네트워크를 상징하는 도형 */}
          <circle cx="12" cy="15" r="3" fill="url(#gradient)" />
          <circle cx="28" cy="15" r="3" fill="url(#gradient)" />
          <circle cx="20" cy="28" r="3" fill="url(#gradient)" />
          
          {/* 연결선 */}
          <path
            d="M15 15 L25 15 M16 18 L24 25 M24 18 L16 25"
            stroke="url(#gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          {/* 중앙의 'M' 모양 */}
          <path
            d="M17 20 L20 23 L23 20"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${config.text}`}>
            마자영
          </span>
          <span className="text-xs text-gray-500 -mt-1">마케팅 자영업자 영입</span>
        </div>
      )}
    </div>
  );
}