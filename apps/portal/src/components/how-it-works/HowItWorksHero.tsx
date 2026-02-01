'use client';

import { SectionGrid, GridColumn } from "./SectionGrid";
import { cn } from "@/lib/utils";

interface HowItWorksHeroProps {
    title: string;
    subtitle: string;
    label: string;
    accentColor: "rose" | "blue" | "emerald" | "amber" | "purple";
    visual?: React.ReactNode;
    visualPosition?: "left" | "right";
}

export function HowItWorksHero({ title, subtitle, label, accentColor, visual, visualPosition = "right" }: HowItWorksHeroProps) {

    const colorStyles = {
        rose: {
            pill: "bg-rose-50 border-rose-200 text-rose-600",
            text: "text-rose-600",
        },
        blue: {
            pill: "bg-blue-50 border-blue-200 text-blue-600",
            text: "text-blue-600",
        },
        emerald: {
            pill: "bg-emerald-50 border-emerald-200 text-emerald-600",
            text: "text-emerald-600",
        },
        amber: {
            pill: "bg-amber-50 border-amber-200 text-amber-600",
            text: "text-amber-600",
        },
        purple: {
            pill: "bg-purple-50 border-purple-200 text-purple-600",
            text: "text-purple-600",
        },
    };

    const style = colorStyles[accentColor];

    return (
        <SectionGrid className="pt-32 pb-16">
            {visual && visualPosition === "left" && (
                <GridColumn span={6} className="relative flex items-center justify-center md:justify-start mb-8 md:mb-0">
                    {visual}
                </GridColumn>
            )}

            <GridColumn span={visual ? 6 : 8} className={visual ? (visualPosition === "left" ? "md:pl-12" : "md:pr-12") : "mx-auto text-center"}>
                <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-8", style.pill)}>
                    {label}
                </div>
                <h1 className="text-5xl md:text-6xl font-serif font-black text-slate-900 mb-6 leading-tight">
                    {title}
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                    {subtitle}
                </p>
            </GridColumn>

            {visual && visualPosition === "right" && (
                <GridColumn span={6} className="relative flex items-center justify-center md:justify-end mt-8 md:mt-0">
                    {visual}
                </GridColumn>
            )}
        </SectionGrid>
    );
}
