export default function SocialIcon({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-8 h-8 bg-white rounded-[5px] border flex items-center justify-center ${className}`}>
      {children}
    </div>
  )
}