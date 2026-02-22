"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface AdvancedFiltersProps {
    children: React.ReactNode;
}

export function AdvancedFilters({ children }: AdvancedFiltersProps) {
    return (
        <AccordionPrimitive.Root type="single" collapsible className="w-full">
            <AccordionPrimitive.Item value="advanced" className="border-none">
                <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between py-4 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline transition-all group">
                        Advanced Filters
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="pb-4 pt-4 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        {children}
                    </div>
                </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
        </AccordionPrimitive.Root>
    );
}
