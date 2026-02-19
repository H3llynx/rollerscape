import L from "leaflet";
import { CheckLine, Eye, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Marker, Popup } from 'react-leaflet';
import Roller from "../../../../assets/marker.png";
import { Button } from "../../../../components/Button/Button";
import type { SpotWithTypes } from "../../../../types/spots_types";
import "./SpotMarker.css";

type SpotMarker = {
    spot: SpotWithTypes;
    onMarkerClick: () => void;
    dimmed: boolean;
}

const spotIcon = L.icon({
    iconUrl: Roller,
    iconSize: [50, 50],
    iconAnchor: [60, 10],
    popupAnchor: [-40, -15],
    className: "drop-shadow-lg drop-shadow-rgba-grey"
});

export function SpotMarker({ spot, dimmed, onMarkerClick }: SpotMarker) {
    const [visible, setVisible] = useState<boolean>(false);
    const [clamped, setClamped] = useState<boolean>(false);
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const description = descriptionRef.current;
        if (description && !visible) {
            setClamped(description.scrollHeight > 32);
        }
    }, [visible]);
    useEffect(() => {
        const el = descriptionRef.current;
        if (!el) return;

        const observer = new ResizeObserver(() => {
            if (!visible) setClamped(el.scrollHeight > el.clientHeight);
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, [visible]);

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
                <div className="flex-container">
                    <h3>{spot.name}</h3>
                    <Button style="icon" aria-label="view spot information" className="text-grey">
                        <Eye aria-hidden />
                    </Button>
                </div>
                <div className="flex-container address">
                    <MapPin aria-hidden width={15} /><span>{spot.address}</span>
                </div>
                <div className="flex-container surface">
                    <p>Surface quality: {spot.surface_quality}</p>
                    {spot.has_obstacles && <span className="flex items-center gap-[5px] text-text-secondary font-medium">
                        <CheckLine width={15} /> Obstacles</span>}
                </div>
                {spot.description &&
                    <>
                        <p
                            ref={descriptionRef}
                            className={`text-xs my-0 ${visible ? "my-0" : "clamped"}`}
                        > {spot.description}
                        </p>
                        {clamped &&
                            <Button style="readMore" onClick={() => setVisible(!visible)}>
                                Read more
                            </Button>
                        }
                    </>
                }
                {spot.photos && spot.photos.slice(0, 3).map((photo, i) => (
                    <div key={i} className="image-container">
                        <img src={photo} alt="" />
                    </div>
                ))}
            </Popup>
        </Marker >
    )
}