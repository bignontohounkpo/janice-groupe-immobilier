import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: LucideIcon
  iconBgColor: string
  iconColor: string
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor,
  iconColor
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border flex items-start gap-4 transition-all hover:shadow-md">
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBgColor, color: iconColor }}
      >
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </div>
  )
}
