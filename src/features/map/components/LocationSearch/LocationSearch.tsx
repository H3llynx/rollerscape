import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '../../../../components/Button/Button';
import { useSpots } from '../../hooks/useSpots';
import "./LocationSearch.css";

export function LocationSearch() {
    const map = useMap();
    const [expanded, setExpanded] = useState<boolean>(false);
    const { selectedSpot, setSelectedSpot } = useSpots();

    const handleSearch = async (e: React.SubmitEvent) => {
        if (selectedSpot) setSelectedSpot(null);
        e.preventDefault();
        const location = new FormData(e.target).get("location");
        const result = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`
        );
        const data = await result.json();
        if (data.length > 0) {
            const { lat, lon } = data[0];
            map.flyTo([lat, lon], 12);
        }
    };

    return (
        <div className="search-container">
            <form
                id="search-form"
                onSubmit={handleSearch}
            >
                <input
                    name="location"
                    className="slight-shadow bg-blur text-dark w-full h-full border-grey"
                    placeholder="Search a location..."
                />
                <Button
                    style="search"
                    aria-label="Search location"
                    className="search-button">
                    <Search aria-hidden />
                </Button>
            </form>
            <label
                className={`${expanded ? "bg-bg-rgba bg-blur" : "bg-bg-cta"} expand-search-cta`}
                aria-hidden
                htmlFor="expand-search">
                {expanded
                    ? <X aria-hidden color="var(--color-text)" strokeWidth={2} />
                    : <Search aria-hidden />
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