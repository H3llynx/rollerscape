export function MobileHideButton({ onClick }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className="md:hidden flex justify-center w-full p-[10px] h-2"
            aria-label="Hide spot details"
            onClick={onClick}
        >
            <div className="h-[6px] rounded-full w-[90px] bg-border opacity-60"></div>
        </button>
    )
}