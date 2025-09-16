import type { ReactNode } from "react"

interface MobileContainerProps {
  children: ReactNode
}

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-background rounded-3xl shadow-2xl overflow-hidden">
        <div className="h-screen max-h-[800px] flex flex-col">{children}</div>
      </div>
    </div>
  )
}
