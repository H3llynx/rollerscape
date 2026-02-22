import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router";
import { Header } from "../../components/Header/Header";
import { fetchBySlug } from "../../services/spots";
import type { SpotWithTypes } from "../../types/spots_types";
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
                <main className="w-full h-full ">
                    <section className="grid w-full md:grid-cols-2 gap-3 md:gap-0 h-full">
                        <article className="grid-left-article text-base scroll items-start">
                            <NavLink to="/" className="flex items-center gap-[5px] font-medium text-grey text-sm hover:text-text-secondary">
                                <ArrowLeft aria-hidden width={15} /> Back to map</NavLink>
                            <SpotDescription spot={spot} />
                        </article>
                        <SingleSpotMap spot={spot} />
                    </section>
                </main>
            }
        </>
    )
}