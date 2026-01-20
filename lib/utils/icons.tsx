import type React from "react"
import * as LucideIcons from "lucide-react"

// List of available icons for the picker
export const AVAILABLE_ICONS = [
  "Building2",
  "Users",
  "FileText",
  "Briefcase",
  "Calendar",
  "Settings",
  "Mail",
  "Phone",
  "MapPin",
  "Globe",
  "Search",
  "Filter",
  "TrendingUp",
  "Award",
  "Crown",
  "Rocket",
  "Zap",
  "Sparkles",
  "Heart",
  "Star",
  "Target",
  "CheckCircle",
  "Shield",
  "Lock",
  "Key",
  "Database",
  "Server",
  "Cloud",
  "Code",
  "Terminal",
  "Package",
  "Layers",
  "Grid3x3",
  "FolderTree",
  "Folder",
  "File",
  "Image",
  "Video",
  "Music",
  "Headphones",
  "Mic",
  "Camera",
  "Printer",
  "Monitor",
  "Smartphone",
  "Tablet",
  "Laptop",
  "Watch",
  "Wifi",
  "Bluetooth",
  "Battery",
  "Plug",
  "Lightbulb",
  "Home",
  "Store",
  "ShoppingCart",
  "CreditCard",
  "DollarSign",
  "TrendingDown",
  "BarChart",
  "PieChart",
  "Activity",
  "Clipboard",
  "ClipboardCheck",
  "BookOpen",
  "GraduationCap",
  "Bookmark",
  "Tag",
  "Flag",
  "Bell",
  "MessageSquare",
  "MessageCircle",
  "Send",
  "Inbox",
  "Archive",
  "Trash2",
  "Edit",
  "Plus",
  "Minus",
  "X",
  "Check",
  "ChevronRight",
  "ChevronLeft",
  "ChevronUp",
  "ChevronDown",
  "ArrowRight",
  "ArrowLeft",
  "ArrowUp",
  "ArrowDown",
  "RefreshCw",
  "RotateCw",
  "Download",
  "Upload",
  "Share2",
  "Link",
  "ExternalLink",
  "Eye",
  "EyeOff",
  "Info",
  "AlertCircle",
  "AlertTriangle",
  "HelpCircle",
  "MoreHorizontal",
  "MoreVertical",
  "Menu",
  "Maximize",
  "Minimize",
  "Copy",
  "Scissors",
  "Paperclip",
  "ChartLine",
  "Calculator",
  "HardHat",
  "HeartPulse",
  "Circle",
] as const

export type IconName = (typeof AVAILABLE_ICONS)[number]

// Render an icon from its string name
export function renderIcon(iconName: string, props?: React.ComponentProps<LucideIcons.LucideIcon>) {
  // 1. Try direct lookup
  let Icon = (LucideIcons as any)[iconName]

  // 2. Try PascalCase conversion (e.g. "chart-line" -> "ChartLine")
  if (!Icon && typeof iconName === "string") {
    const pascalName = iconName
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("")
    Icon = (LucideIcons as any)[pascalName]
  }

  // 3. Manual mappings
  if (!Icon) {
    if (iconName === "heartbeat") Icon = (LucideIcons as any)["HeartPulse"]
  }

  if (!Icon) {
    // Fallback to a default icon if the name is not found
    return <LucideIcons.HelpCircle {...props} />
  }

  const Component = Icon as LucideIcons.LucideIcon
  return <Component {...props} />
}
