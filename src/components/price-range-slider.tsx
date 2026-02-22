"use client";

import { Range, getTrackBackground } from "react-range";
import { useState, useEffect } from "react";

interface PriceRangeSliderProps {
    min: number;
    max: number;
    step: number;
    values: [number, number];
    onChange: (values: [number, number]) => void;
}

export function PriceRangeSlider({ min, max, step, values, onChange }: PriceRangeSliderProps) {
    const [localValues, setLocalValues] = useState<number[]>(values);

    useEffect(() => {
        setLocalValues(values);
    }, [values]);

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
        return `₹${price.toLocaleString()}`;
    };

    return (
        <div className="px-2 pt-8 pb-4">
            <Range
                step={step}
                min={min}
                max={max}
                values={localValues}
                onChange={(vals) => setLocalValues(vals)}
                onFinalChange={(vals) => onChange([vals[0], vals[1]])}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        className="h-9 flex w-full"
                        style={props.style}
                    >
                        <div
                            ref={props.ref}
                            className="h-1.5 w-full rounded-full self-center"
                            style={{
                                background: getTrackBackground({
                                    values: localValues,
                                    colors: ["#e5e7eb", "#3b82f6", "#e5e7eb"],
                                    min: min,
                                    max: max,
                                    direction: 1 as any,
                                }),
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({ index, props, isDragged }) => (
                    <div
                        {...props}
                        className="h-5 w-5 rounded-full bg-white dark:bg-neutral-900 border-2 border-blue-500 shadow-lg flex items-center justify-center outline-none focus:ring-4 focus:ring-blue-500/20"
                        style={props.style}
                    >
                        <div className="absolute -top-10 px-2 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold shadow-md transform -translate-y-1">
                            {formatPrice(localValues[index])}
                        </div>
                        <div
                            className={`h-2 w-2 rounded-full transition-colors ${isDragged ? "bg-blue-600" : "bg-blue-400"
                                }`}
                        />
                    </div>
                )}
            />
            <div className="flex justify-between items-center mt-2 text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
                <span>{formatPrice(min)}</span>
                <span>{formatPrice(max)}</span>
            </div>
        </div>
    );
}
