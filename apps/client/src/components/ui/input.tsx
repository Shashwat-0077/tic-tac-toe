import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const inputVariants = cva("", {
    variants: {
        variant: {
            default:
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            labelAsPlaceholder:
                "text-[16px] pl-[5px] pr-[10px] py-[10px] block w-[150px] border-b-[1px] border-b-[1px_solid_#515151] bg-transparent focus:outline-none text-white border-b-[1px]",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
        VariantProps<typeof inputVariants> {
    label?: string;
    state?: string;
    setState?: (username: string) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, variant, label, state, setState, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);

        if (
            variant === null ||
            variant === undefined ||
            label === undefined ||
            state === undefined ||
            setState === undefined
        ) {
            return (
                <input
                    type={type}
                    className={cn(
                        inputVariants({ variant: "default", className })
                    )}
                    ref={ref}
                    {...props}
                />
            );
        } else {
            // [ ] Edit this style so that it can compensate with other width and heights
            return (
                <div className="relative">
                    <input
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.preventDefault();
                            setState(e.target.value);
                        }}
                        className={cn(inputVariants({ variant, className }))}
                        onFocus={() => {
                            setIsFocused(true);
                        }}
                        onBlur={() => {
                            setIsFocused(false);
                        }}
                        {...props}
                    />
                    <span
                        className={`relative block w-[150px] before:h-[2px] before:w-[0] before:bottom-px before:absolute before:bg-[#5cdb95] before:[transition:0.2s_ease_all] before:left-2/4 after:h-[2px] after:w-[0] after:bottom-px after:absolute after:bg-[#5cdb95] after:[transition:0.2s_ease_all] after:right-2/4  ${
                            isFocused || state
                                ? "before:!w-1/2 after:!w-1/2"
                                : ""
                        }`}
                    ></span>
                    <label className="text-[#999] text-[18px] font-normal absolute pointer-events-none left-[5px] top-[10px] flex">
                        {label.split("").map((char, index) => (
                            <span
                                key={index}
                                style={{
                                    transitionDelay: index * 0.02 + "s",
                                }}
                                className={`[transition:0.2s_ease_all] group-focus:-translate-y-[20px] group-focus:text-[14px] group-focus:text-[#5cdb95] ${
                                    isFocused || state
                                        ? "-translate-y-[20px] text-[14px] text-[#5cdb95]"
                                        : ""
                                }`}
                            >
                                {char === " " ? <>&nbsp;</> : char}
                            </span>
                        ))}
                    </label>
                </div>
            );
        }
    }
);
Input.displayName = "Input";

export { Input };
