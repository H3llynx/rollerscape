import { SlidersHorizontal } from "lucide-react";
import { useRef, type Dispatch, type SetStateAction } from "react";
import type { SpotType } from "../../../../types/spots_types";
import { getSpotType, handleAria } from "../../../../utils/helpers";
import "./MapFilters.css";

type MapFilter = {
    spotTypes: SpotType[];
    checkedTypes: SpotType[];
    setCheckedTypes: Dispatch<SetStateAction<SpotType[]>>
}

export function MapFilters({ spotTypes, checkedTypes, setCheckedTypes }: MapFilter) {
    const expandFiltersRef = useRef<HTMLInputElement>(null)

    const handleTypeChange = (filter: SpotType) => {
        setCheckedTypes((types) => types.includes(filter)
            ? types.filter(type => type !== filter)
            : [...types, filter])
    };

    const handleSelectAll = () => {
        checkedTypes !== (spotTypes)
            ? setCheckedTypes(spotTypes)
            : setCheckedTypes([]);
    }

    const allChecked = checkedTypes.length === spotTypes.length;

    return (
        <div className="filter-container">
            <div id="spot-type-filters">
                <label className="map-label">
                    <input
                        type="checkbox"
                        checked={checkedTypes === spotTypes}
                        onChange={handleSelectAll}
                        value={"all"}
                    />
                    <span className="text-text-secondary">
                        {allChecked ? "Clear all" : "Select all"}
                    </span>
                </label>
                {spotTypes.map(type => (
                    <label className="map-label" key={type}>
                        <input
                            type="checkbox"
                            checked={checkedTypes.includes(type)}
                            onChange={() => handleTypeChange(type)}
                            value={type}
                        />
                        {getSpotType(type)}
                    </label>
                ))}
            </div>
            <label className="expand-filters-cta" aria-label="Expand filters" htmlFor="expand-filters">
                <SlidersHorizontal aria-hidden className="expand-filters-icon" />
                <input className="sr-only"
                    type="checkbox"
                    id="expand-filters"
                    aria-expanded="false"
                    aria-controls="spot-type-filters"
                    ref={expandFiltersRef}
                    onChange={() => handleAria(expandFiltersRef)}
                />
            </label>
        </div>
    )
}