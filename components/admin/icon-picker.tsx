"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { AVAILABLE_ICONS, renderIcon } from "@/lib/utils/icons"
import { useLanguage } from "@/lib/i18n/language-context"

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          <div className="flex items-center gap-2">
            {value && renderIcon(value, { className: "h-4 w-4" })}
            <span>{value || t("admin.selectIcon")}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder={t("admin.searchIcon")} />
          <CommandList>
            <CommandEmpty>{t("admin.noIconFound")}</CommandEmpty>
            <CommandGroup>
              <div className="grid grid-cols-4 gap-1 p-2">
                {AVAILABLE_ICONS.map((iconName) => (
                  <CommandItem
                    key={iconName}
                    value={iconName}
                    onSelect={() => {
                      onChange(iconName)
                      setOpen(false)
                    }}
                    className="flex flex-col items-center justify-center gap-1 p-3 cursor-pointer"
                  >
                    {renderIcon(iconName, {
                      className: cn("h-6 w-6", value === iconName && "text-primary"),
                    })}
                    <span className="text-[10px] text-center leading-tight">{iconName}</span>
                    {value === iconName && <Check className="h-3 w-3 text-primary" />}
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
