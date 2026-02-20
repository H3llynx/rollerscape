import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { Header } from "../../components/Header/Header";
import type { SpotWithTypes } from "../../types/spots_types";
import { fetchBySlug } from "../map/services/spots";
import { SingleSpotMap } from "./components/SingleSpotMap/SingleSpotMap";
import { SpotDescription } from "./components/SpotDescription/SpotDescription";

export function SpotPage() {
    const { slug } = useParams();
    const { state } = useLocation();
    const [spot, setSpot] = useState<SpotWithTypes | null>(state?.spot ?? null);

    useEffect(() => {
        const getSpot = async () => {
            if (!spot && slug) {
                const { data } = await fetchBySlug(slug)
                setSpot(data);
            }
        }
        getSpot();
    }, [slug]);

    return (
        <>
            <Header />
            {spot &&
                <main>
                    <section className="grid w-full md:grid-cols-2 gap-3 md:gap-0 h-full">
                        <SpotDescription spot={spot} />
                        <SingleSpotMap spot={spot} />
                    </section>
                </main>
            }
        </>
    )
}