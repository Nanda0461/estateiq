export function SkeletonCard() {
    return (
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="h-52 skeleton" />
            <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 rounded-lg skeleton" />
                <div className="h-4 w-1/2 rounded-lg skeleton" />
                <div className="flex gap-4">
                    <div className="h-4 w-16 rounded-lg skeleton" />
                    <div className="h-4 w-16 rounded-lg skeleton" />
                    <div className="h-4 w-16 rounded-lg skeleton" />
                </div>
            </div>
        </div>
    );
}
