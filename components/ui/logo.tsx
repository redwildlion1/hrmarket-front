import React from "react"

export const Logo = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M50 20C50 40 40 50 20 50C40 50 50 60 50 80C50 60 60 50 80 50C60 50 50 40 50 20Z" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M72 25V35M67 30H77" 
      stroke="currentColor" 
      strokeWidth="5" 
      strokeLinecap="round"
    />
    <path 
      d="M30 65V71M27 68H33" 
      stroke="currentColor" 
      strokeWidth="5" 
      strokeLinecap="round"
    />
  </svg>
)