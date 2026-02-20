import L from "leaflet";
import { CheckLine, Eye, MapPin, Navigation, Share } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Marker, Popup } from 'react-leaflet';
import { NavLink } from "react-router";
import Roller from "../../../../assets/marker.png";
import { Button } from "../../../../components/Button/Button";
import type { SpotWithTypes } from "../../../../types/spots_types";
import "./SpotMarker.css";

type SpotMarker = {
    spot: SpotWithTypes;
    onMarkerClick?: () => void;
    dimmed?: boolean;
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

    const handleToGps = () => {
        if (spot.location_type === "point") {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const url = isIOS
                ? `maps://maps.apple.com/?ll=${spot.display_lat},${spot.display_lon}&q=${encodeURIComponent(spot.name)}`
                : `https://www.google.com/maps?q=${spot.display_lat},${spot.display_lon}`;

            window.open(url, '_blank');
        }
        else if (spot.location_type === "route") {
            const waypoints = spot.coordinates.map(point => ({ lat: point.lat, lon: point.lon }));

            const origin = waypoints[0];
            const destination = waypoints[waypoints.length - 1];
            const middle = waypoints.slice(1, -1).map(p => `${p.lat},${p.lon}`).join('|');

            let url = `https://www.google.com/maps/dir/?api=1`
                + `&origin=${origin.lat},${origin.lon}`
                + `&destination=${destination.lat},${destination.lon}`
                + `&travelmode=walking`;

            if (middle) url += `&waypoints=${middle}`;

            window.open(url, "_blank");
        };
    };

    const handleShare = async () => {
        const url = `https://www.google.com/maps?q=${spot.display_lat},${spot.display_lon}`;
        try {
            await navigator.share({
                title: `Spot roller : ${spot.name}`,
                text: "Check out this spot! 🛼",
                url: url
            });
        } catch (error) {
            if (error instanceof Error && (error.name !== "AbortError")) {
                navigator.clipboard.writeText(url);
                alert("copied to clipboard");
            }
        }
    };

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

                        {spot.photos &&
                            <div className="flex-container py-0.5 pr-0.5">
                                {spot.photos.slice(0, 3).map((photo, i) => (
                                    <div key={i} className="image-container">
                                        <img src={photo} alt="" />
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                    <div className="button-container">
                        <NavLink
                            to={`/spot/${spot.slug}`}
                            state={{ spot }}
                            aria-label="view spot information"
                        >
                            <Eye aria-hidden />
                        </NavLink>
                        <Button style="icon" aria-label="share spot" onClick={handleShare}>
                            <Share aria-hidden />
                        </Button>
                        <Button style="icon" aria-label="Send to GPS app" onClick={handleToGps}>
                            <Navigation aria-hidden />
                        </Button>
                    </div>
                </div>
            </Popup>
        </Marker >
    )
}