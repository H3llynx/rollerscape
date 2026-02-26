import { useNavigate } from "react-router";
import type { SpotFullInfo } from "../../../../types/spots_types";
import { getSpotType } from "../../../../utils/helpers";
import { Map } from "../../../map/components/Map/Map";
import { ButtonContainer } from "../../../spot_management/components/ButtonContainer/ButtonContainer";
import { FavoriteMarker } from "../FavoriteMarker/FavoriteMarker";

export function FavoriteSpotCard({ spot }: { spot: SpotFullInfo }) {
    const navigate = useNavigate();

    return (
        <div className="card p-0">
            <div className="p-1 border">
                <h3 className="font-title text-text-secondary text-lg">{spot.name}</h3>
                <p>{spot.address}</p>
                <div className="flex gap-0.5">
                    {spot.spot_spot_types.map((type, i) => (
                        <span className="tag" key={i} >
                            {getSpotType(type.name)}
                        </span>
                    )
                    )}
                </div>
                <ButtonContainer variant="favorite" spot={spot} onEdit={() => navigate(`/?${spot.slug}=expanded`)} />
            </div>
            <div className="w-10 h-10">
                <Map
                    center={[spot.coordinates[0].lat, spot.coordinates[0].lon]}
                    zoom={13}
                    controls={false}
                >
                    <FavoriteMarker
                        position={[spot.coordinates[0].lat, spot.coordinates[0].lon]} />
                </Map>
            </div>
        </div>
    )
}