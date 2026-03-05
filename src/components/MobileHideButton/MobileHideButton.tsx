import { usePanelSize } from "../../features/map/hooks/useContexts";


export function MobileHideButton() {
    const { textSmaller, setTextSmaller } = usePanelSize();
    return (
        <button
            className="md:hidden flex justify-center w-full p-[8px] h-1.5"
            aria-label="Hide spot details"
            onClick={() => { setTextSmaller(!textSmaller) }}>
            <div className="h-[4px] rounded-full w-[40px] bg-border opacity-60"></div>
        </button>
    )
}