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
        <div className="relative inline-flex items-center justify-center align-middle group">
            <input
                type="checkbox"
                className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0"
                checked={checked}
                onChange={handleChange}
                {...props}
            />
            <div
                className={cn(
                    'h-4 w-4 shrink-0 rounded-sm border border-primary shadow-sm transition-all',
                    'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
                    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                    'peer-checked:bg-primary peer-checked:text-primary-foreground',
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
