interface LoadingProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

export function Loading({ message = "Chargement", size = "md" }: LoadingProps) {
  const dotSize = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex items-center gap-1.5">
        <span className={`rounded-full bg-muted-foreground/40 ${dotSize[size]} animate-[pulse_1.5s_ease-in-out_infinite]`} style={{ animationDelay: "0ms" }} />
        <span className={`rounded-full bg-muted-foreground/40 ${dotSize[size]} animate-[pulse_1.5s_ease-in-out_infinite]`} style={{ animationDelay: "200ms" }} />
        <span className={`rounded-full bg-muted-foreground/40 ${dotSize[size]} animate-[pulse_1.5s_ease-in-out_infinite]`} style={{ animationDelay: "400ms" }} />
      </div>
      {message && (
        <p className={`text-muted-foreground ${textSizeClasses[size]}`}>
          {message}
        </p>
      )}
    </div>
  )
}
