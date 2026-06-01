"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidbuttonVariants = cva(
  "inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]/40",
  {
    variants: {
      variant: {
        default:
          "bg-transparent hover:scale-105 duration-300 transition text-[#60A5FA]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 text-xs gap-1.5 px-4 has-[>svg]:px-4",
        lg: "h-10 rounded-full px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-full px-8 has-[>svg]:px-6",
        xxl: "h-14 rounded-full px-10 has-[>svg]:px-8",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "xxl" },
  }
);

function GlassFilter() {
  return (
    <svg className="hidden" aria-hidden>
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves={1}
            seed={1}
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation={2} result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale={70}
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation={4} result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  if (asChild) {
    return (
      <>
        <Comp
          data-slot="button"
          className={cn(
            "relative group inline-flex items-center justify-center rounded-full border border-[rgba(96,165,250,0.35)] bg-[rgba(96,165,250,0.06)] backdrop-blur-xl shadow-[0_0_24px_rgba(96,165,250,0.12)]",
            liquidbuttonVariants({ variant, size, className })
          )}
          {...props}
        >
          {children}
        </Comp>
        <GlassFilter />
      </>
    );
  }

  return (
    <>
      <Comp
        data-slot="button"
        className={cn("relative group", liquidbuttonVariants({ variant, size, className }))}
        {...props}
      >
        <div
          className="absolute top-0 left-0 z-0 h-full w-full rounded-full shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_24px_rgba(96,165,250,0.12)] transition-all border border-[rgba(96,165,250,0.35)] bg-[rgba(96,165,250,0.06)]"
        />
        <div
          className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-full backdrop-blur-xl"
          style={{ backdropFilter: 'url("#container-glass")' }}
        />
        <div className="pointer-events-none relative z-10 flex items-center justify-center gap-2">
          {children}
        </div>
        <GlassFilter />
      </Comp>
    </>
  );
}

type ColorVariant = "default" | "primary" | "success" | "error" | "gold" | "bronze";

interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant;
}

const colorVariants: Record<
  ColorVariant,
  { outer: string; inner: string; button: string; textColor: string; textShadow: string }
> = {
  default: {
    outer: "bg-gradient-to-b from-[#000] to-[#A0A0A0]",
    inner: "bg-gradient-to-b from-[#FAFAFA] via-[#3E3E3E] to-[#E5E5E5]",
    button: "bg-gradient-to-b from-[#B9B9B9] to-[#969696]",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(80_80_80_/_100%)]",
  },
  primary: {
    outer: "bg-gradient-to-b from-[#000] to-[#A0A0A0]",
    inner: "bg-gradient-to-b from-[#60A5FA] via-[#3B82F6] to-[#1a1a1a]",
    button: "bg-gradient-to-b from-[#60A5FA] to-[#3B82F6]",
    textColor: "text-black",
    textShadow: "[text-shadow:_0_-1px_0_rgb(120_80_0_/_40%)]",
  },
  success: {
    outer: "bg-gradient-to-b from-[#005A43] to-[#7CCB9B]",
    inner: "bg-gradient-to-b from-[#E5F8F0] via-[#00352F] to-[#D1F0E6]",
    button: "bg-gradient-to-b from-[#9ADBC8] to-[#3E8F7C]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(6_78_59_/_100%)]",
  },
  error: {
    outer: "bg-gradient-to-b from-[#5A0000] to-[#FFAEB0]",
    inner: "bg-gradient-to-b from-[#FFDEDE] via-[#680002] to-[#FFE9E9]",
    button: "bg-gradient-to-b from-[#F08D8F] to-[#A45253]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(146_64_14_/_100%)]",
  },
  gold: {
    outer: "bg-gradient-to-b from-[#917100] to-[#EAD98F]",
    inner: "bg-gradient-to-b from-[#FFFDDD] via-[#856807] to-[#FFF1B3]",
    button: "bg-gradient-to-b from-[#FFEBA1] to-[#9B873F]",
    textColor: "text-[#1a1200]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(178_140_2_/_30%)]",
  },
  bronze: {
    outer: "bg-gradient-to-b from-[#864813] to-[#E9B486]",
    inner: "bg-gradient-to-b from-[#EDC5A1] via-[#5F2D01] to-[#FFDEC1]",
    button: "bg-gradient-to-b from-[#FFE3C9] to-[#A36F3D]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(124_45_18_/_100%)]",
  },
};

function metalButtonVariants(
  variant: ColorVariant = "default",
  isPressed: boolean,
  isHovered: boolean,
  isTouchDevice: boolean
) {
  const colors = colorVariants[variant];
  const transitionStyle = "all 250ms cubic-bezier(0.1, 0.4, 0.2, 1)";

  return {
    wrapper: cn("relative inline-flex transform-gpu rounded-md p-[1.25px] will-change-transform w-full justify-center", colors.outer),
    wrapperStyle: {
      transform: isPressed ? "translateY(2.5px) scale(0.99)" : "translateY(0) scale(1)",
      boxShadow: isPressed
        ? "0 1px 2px rgba(0, 0, 0, 0.15)"
        : isHovered && !isTouchDevice
          ? "0 4px 20px rgba(96, 165, 250, 0.25)"
          : "0 3px 12px rgba(0, 0, 0, 0.2)",
      transition: transitionStyle,
    },
    inner: cn("absolute inset-[1px] transform-gpu rounded-lg will-change-transform", colors.inner),
    innerStyle: { transition: transitionStyle, filter: isHovered && !isPressed && !isTouchDevice ? "brightness(1.05)" : "none" },
    button: cn(
      "relative z-10 m-[1px] rounded-md inline-flex h-12 w-full transform-gpu cursor-pointer items-center justify-center overflow-hidden rounded-md px-6 py-2 text-sm leading-none font-black tracking-[0.15em] uppercase will-change-transform outline-none",
      colors.button,
      colors.textColor,
      colors.textShadow
    ),
    buttonStyle: {
      transform: isPressed ? "scale(0.97)" : "scale(1)",
      transition: transitionStyle,
    },
  };
}

function ShineEffect({ isPressed }: { isPressed: boolean }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-300", isPressed ? "opacity-20" : "opacity-0")}>
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-neutral-100 to-transparent" />
    </div>
  );
}

export const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  ({ children, className, variant = "gold", ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isTouchDevice, setIsTouchDevice] = React.useState(false);

    React.useEffect(() => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    }, []);

    const variants = metalButtonVariants(variant, isPressed, isHovered, isTouchDevice);

    return (
      <div className={variants.wrapper} style={variants.wrapperStyle}>
        <div className={variants.inner} style={variants.innerStyle} />
        <button
          ref={ref}
          className={cn(variants.button, className)}
          style={variants.buttonStyle}
          {...props}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => { setIsPressed(false); setIsHovered(false); }}
          onMouseEnter={() => { if (!isTouchDevice) setIsHovered(true); }}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          onTouchCancel={() => setIsPressed(false)}
        >
          <ShineEffect isPressed={isPressed} />
          {children}
          {isHovered && !isPressed && !isTouchDevice && (
            <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-t from-transparent to-white/10" />
          )}
        </button>
      </div>
    );
  }
);
MetalButton.displayName = "MetalButton";

export { liquidbuttonVariants };
