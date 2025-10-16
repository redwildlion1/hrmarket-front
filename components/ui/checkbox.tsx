'use client'

import * as React from 'react'
import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onCheckedChange?: (checked: boolean) => void
}

function Checkbox({ className, checked, onCheckedChange, onChange, ...props }: CheckboxProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e)
        onCheckedChange?.(e.target.checked)
    }

    return (
        <div className="relative inline-flex items-center">
            <input
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                onChange={handleChange}
                {...props}
            />
            <div
                className={cn(
                    'peer h-4 w-4 shrink-0 rounded-sm border border-input shadow-xs transition-all outline-none',
                    'peer-focus-visible:border-ring peer-focus-visible:ring-ring/50 peer-focus-visible:ring-[3px]',
                    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                    'peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary',
                    'flex items-center justify-center',
                    className,
                )}
            >
                <CheckIcon
                    className={cn(
                        'h-3 w-3 text-current transition-opacity',
                        checked ? 'opacity-100' : 'opacity-0'
                    )}
                />
            </div>
        </div>
    )
}

export { Checkbox }