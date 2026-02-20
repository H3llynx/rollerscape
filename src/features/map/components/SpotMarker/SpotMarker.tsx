import L from "leaflet";
import { CheckLine, Eye, MapPin, Navigation, Share } from "lucide-react";
import { useRef, useState } from "react";
import { Marker, Popup } from 'react-leaflet';
import { NavLink } from "react-router";
import Roller from "../../../../assets/marker.png";
import { Button } from "../../../../components/Button/Button";
import type { SpotWithTypes } from "../../../../types/spots_types";
import { sendToGps, shareSpot } from "../../services/spots";
import "./SpotMarker.css";

type SpotMarker = {
    spot: SpotWithTypes;
    onMarkerClick?: () => void;
    dimmed?: boolean;
    reduced?: boolean;
}

const spotIcon = L.icon({
    iconUrl: Roller,
    iconSize: [50, 50],
    iconAnchor: [60, 10],
    popupAnchor: [-40, -15],
    className: "drop-shadow-lg drop-shadow-rgba-grey"
});

export function SpotMarker({ spot, dimmed, onMarkerClick, reduced }: SpotMarker) {
    const [visible, setVisible] = useState<boolean>(false);
    const [clamped, setClamped] = useState<boolean>(false);
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    return (
        <Marker
            position={[spot.display_lat, spot.display_lon]}
            icon={spotIcon}
            opacity={dimmed ? 0.3 : 1}
            eventHandlers={{
                click: onMarkerClick,
                popupopen: () => {
                    requestAnimationFrame(() => {
                        const el = descriptionRef.current;
                        if (el) setClamped(el.scrollHeight > el.clientHeight);
                    });
                }
            }}
        >
            <Popup className="spot-marker">
                <h3>{spot.name}</h3>
                <div className="flex gap-0.5 flex-wrap md:flex-nowrap">
                    <div>
                        <div className="flex-container address">
                            <MapPin aria-hidden width={15} /><span>{spot.address}</span>
                        </div>
                        <div className="flex-container surface">
                            <span className="font-medium">Surface quality: {spot.surface_quality}</span>
                            {spot.has_obstacles && <span className="flex items-center gap-[5px] text-text-secondary font-medium">
                                <CheckLine width={15} /> Obstacles</span>}
                        </div>
                        {!reduced &&
                            <>
                                {spot.description &&
                                    <>
                                        <p
                                            ref={descriptionRef}
                                            className={`text-[0.8rem] my-0 ${visible ? "my-0" : "clamped"}`}
                                        > {spot.description}
                                        </p>
                                        {clamped &&
                                            <Button style="readMore" onClick={() => setVisible(!visible)}>
                                                Read more
                                            </Button>
                                        }
                                    </>
                                }

                                {spot.photos && spot.photos.length > 0 &&
                                    <div className="flex-container py-0.5 pr-0.5">
                                        {spot.photos.slice(0, 3).map((photo, i) => (
                                            <div key={i} className="image-container">
                                                <img src={photo} alt="" />
                                            </div>
                                        ))}
                                    </div>
                                }
                            </>}
                    </div>
                    <div className="button-container">
                        {!reduced &&
                            <NavLink
                                to={`/spot/${spot.slug}`}
                                state={{ spot }}
                                aria-label="view spot information"
                            >
                                <Eye aria-hidden />
                            </NavLink>
                        }
                        <Button style="icon" aria-label="share spot" onClick={() => shareSpot(spot)}>
                            <Share aria-hidden />
                        </Button>
                        <Button style="icon" aria-label="Send to GPS app" onClick={() => sendToGps(spot)}>
                            <Navigation aria-hidden />
                        </Button>
                    </div>
                </div>
            </Popup>
        </Marker >
    )
}