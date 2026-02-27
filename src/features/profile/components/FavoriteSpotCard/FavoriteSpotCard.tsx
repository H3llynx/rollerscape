import { useNavigate } from "react-router";
import type { SpotFullInfo } from "../../../../types/spots_types";
import { getSpotType } from "../../../../utils/helpers";
import { Map } from "../../../map/components/Map/Map";
import { ButtonContainer } from "../../../spot_management/components/ButtonContainer/ButtonContainer";
import { FavoriteMarker } from "../FavoriteMarker/FavoriteMarker";
import "./FavoriteSpotCard.css";

export function FavoriteSpotCard({ spot }: { spot: SpotFullInfo }) {
    const navigate = useNavigate();

    return (
        <div className="card favorite-map-container">
            <Map
                center={[spot.coordinates[0].lat, spot.coordinates[0].lon]}
                zoom={13}
                controls={false}
            >
                <FavoriteMarker
                    position={[spot.coordinates[0].lat, spot.coordinates[0].lon]} />
            </Map>
            <div className="favorite-text-overlay">
                <button aria-label="See that spot on the map" onClick={() => navigate(`/?${spot.slug}=expanded`)}>
                    <div className="flex flex-col px-1 pt-0.5 h-full my-auto text-left justify-center">
                        <h2 className="text-xl text-dark-3 line-clamp-2">{spot.name}</h2>
                        <p className="text-grey text-xs md:text-sm">{spot.address}</p>
                        <div className="flex gap-0.5 mt-1 items-start">
                            {spot.spot_types.map((type, i) => (
                                <span className="tag" key={i} >
                                    {getSpotType(type.name)}
                                </span>
                            )
                            )}
                        </div>
                    </div>
                </button>
                <div className="w-full flex justify-center sm:w-fit">
                    <ButtonContainer variant="favorite" spot={spot} onEdit={() => navigate(`/?${spot.slug}=expanded`)} />
                </div>
            </div>
        </div>
    )
}