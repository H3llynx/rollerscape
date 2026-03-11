import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '../../../../components/Button/Button';
import { searchOnMap } from '../../../../services/geolocation';
import { useSpots } from '../../hooks/useContexts';
import "./LocationSearch.css";

export function LocationSearch() {
    const map = useMap();
    const [expanded, setExpanded] = useState<boolean>(false);
    const { selectedSpot, setSelectedSpot } = useSpots();
    const [error, setError] = useState(false)

    const handleSearch = async (e: React.SubmitEvent) => {
        if (selectedSpot) setSelectedSpot(null);
        e.preventDefault();
        const location = new FormData(e.target).get("location");
        const data = await searchOnMap(String(location));
        if (!data.length) {
            setError(true);
            return;
        }
        const { lat, lon } = data[0];
        map.flyTo([lat, lon], 14);
    };

    return (
        <div className="search-container">
            <form
                id="search-form"
                onSubmit={handleSearch}
                className={`bg-blur ${error && "outline-2 outline-offset-2 outline-red"}`}
            >
                <input
                    name="location"
                    className="border-0 h-full focus-visible:outline-none"
                    placeholder="City/ Area / Neighborhood"
                    onChange={() => { setError(false) }}
                />
                <Button
                    style="icon"
                    aria-label="Search location"
                    className="search-button">
                    <Search aria-hidden />
                </Button>
            </form>
            <label
                className={`${expanded ? "bg-transparent" : "bg-bg-cta slight-shadow"} expand-search-cta`}
                aria-hidden
                htmlFor="expand-search">
                {expanded
                    ? <X aria-hidden color="var(--color-dark-3)" />
                    : <Search strokeWidth={3} aria-hidden />
                }
                <input className="sr-only"
                    type="checkbox"
                    id="expand-search"
                    onChange={() => setExpanded(!expanded)}
                    checked={expanded}
                />
            </label>
        </div>
    );
}