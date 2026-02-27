import { Search } from 'lucide-react';
import { useRef } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '../../../../components/Button/Button';
import { handleAria } from '../../../../utils/helpers';
import "./LocationSearch.css";

export function LocationSearch() {
    const map = useMap();
    const expandSearchRef = useRef<HTMLInputElement>(null)

    const handleSearch = async (e: React.SubmitEvent) => {
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
                    className="slight-shadow bg-blur text-dark w-full h-full"
                    placeholder="Search a location..."
                />
                <Button
                    style="search"
                    aria-label="Search location"
                    className="absolute right-0 bottom-0 top-0 rounded-r-lg">
                    <Search aria-hidden />
                </Button>
            </form>
            <label className="expand-search-cta" aria-label="Expand search bar" htmlFor="expand-search">
                <Search aria-hidden className="expand-search-icon" />
                <input className="sr-only"
                    type="checkbox"
                    id="expand-search"
                    aria-expanded="false"
                    aria-controls="search-form"
                    ref={expandSearchRef}
                    onChange={() => handleAria(expandSearchRef)}
                />
            </label>
        </div>
    );
}