import { MapPinX } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router";
import { Button } from "../../components/Button/Button";
import { Header } from "../../components/Header/Header";
import { addSpotFields } from "../../config/spots";
import { insertDataWithJunctions, type Table } from "../../services/data";
import { reverseGeocode } from "../../services/geolocation";
import { fetchRoute } from "../../services/spots";
import type { OsrmRoute } from "../../types/geolocation_types";
import type { JsonCoordinates, Route, Spot, SpotType } from "../../types/spots_types";
import { createSlug, osrmToJsonCoords } from "../../utils/helpers";
import supabase from "../../utils/supabase";
import { Map } from "../map/components/Map/Map";
import { ReCenterMap } from "../map/components/ReCenterMap/ReCenterMap";
import { RouteDisplay } from "../map/components/RouteDisplay/RouteDisplay";
import { UserMarker } from "../map/components/UserMarker/UserMarker";
import { useCenter } from "../map/hooks/useCenter";
import { AddSpotForm } from "./components/AddSpotForm/AddSpotForm";
import { LocationTypeForm } from "./components/LocationTypeForm/LocationTypeForm";

const CoordinatePickerPoint = ({ onPick }: { onPick: (lat: number, lon: number) => void }) => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            onPick(lat, lng);
        }
    });
    return null;
};

type RouteCoordinates = {
    start: { lat: number; lon: number } | null;
    end: { lat: number; lon: number } | null;
}

const CoordinatePickerRoute = ({ onPick, routeCoords }: {
    onPick: (lat: number, lon: number, type: "start" | "end") => void;
    routeCoords: RouteCoordinates;
}) => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            if (!routeCoords.start) onPick(lat, lng, "start");
            else onPick(lat, lng, "end");
        }
    });
    return null;
};

export function AddSpotPage() {
    const { center, trackUser, profile } = useCenter();
    const { name, location_type, coordinates, description, surface_quality, spot_types, traffic_level, photos } = addSpotFields;
    const [confirmedLocationType, setConfirmedLocationType] = useState<boolean>(false);
    const [locationType, setLocationType] = useState<Spot["location_type"]>(location_type.options[0] as Spot["location_type"]);
    const [spotCoordinates, setSpotCoordinates] = useState<JsonCoordinates | null>(null)
    const { setValue } = useForm();
    const navigate = useNavigate();
    const [routeCoords, setRouteCoords] = useState<RouteCoordinates>({ start: null, end: null });
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<number>(0);

    const handleRoutePick = (lat: number, lon: number, type: "start" | "end") => {
        setRouteCoords(prev => ({ ...prev, [type]: { lat, lon } }));
    }

    const handleSetLocationType = () => {
        setLocationType(locationType);
        setConfirmedLocationType(true);
        setValue(location_type.db_key, locationType);
    }

    useEffect(() => {
        const getRoute = async () => {
            if (routeCoords.start && routeCoords.end) {
                const data = await fetchRoute(routeCoords.start, routeCoords.end);
                if (data) {
                    const converted = data.map((route: OsrmRoute) => ({
                        coordinates: osrmToJsonCoords(route.geometry.coordinates),
                        distance: route.distance,
                    }));
                    setRoutes(converted);
                }
            }
        };
        getRoute();
    }, [routeCoords]);

    useEffect(() => {
        if (locationType === "route" && routes.length > 0) {
            setSpotCoordinates(routes[selectedRoute].coordinates)
        }
    }, [selectedRoute, routes])

    const addSpot = async (newSpot: Record<string, unknown>) => {
        const coords = newSpot[coordinates.db_key] as JsonCoordinates;
        const geo = await reverseGeocode(coords[0]);
        const slug = createSlug(`${newSpot[name.db_key]}-${geo.city}`);
        const selectedTypes = newSpot[spot_types.db_key] as SpotType[];
        const { data: typeRows } = await supabase.from("spot_types").select("id").in("name", selectedTypes);
        const selectedLevel = newSpot[traffic_level.db_key];
        const { data: levelRow } = await supabase.from("traffic_levels").select("id").eq("name", selectedLevel).maybeSingle();

        const { data, error } = await insertDataWithJunctions(
            "spots",
            {
                name: newSpot[name.db_key],
                description: newSpot[description.db_key] || null,
                location_type: newSpot[location_type.db_key],
                coordinates: coords,
                length_km: locationType === "route" ? Number((routes[selectedRoute].distance / 1000).toFixed(2)) : null,
                surface_quality: Number(newSpot[surface_quality.db_key]),
                city: geo.city,
                country: geo.country,
                address: geo.name,
                photos: newSpot[photos.db_key as keyof Spot] as string[] || [],
                slug,
                created_by: profile?.id ?? null,
            },
            [
                { table: "spot_spot_types", fKey: "spot_type_id", values: typeRows?.map(row => row.id) ?? [] },
                ...(levelRow ? [{ table: "spot_traffic_levels" as Table, fKey: "traffic_level_id", values: [levelRow.id] }] : [])
            ]
        );
        if (error) {
            alert("ERROR");
            return
        }
        navigate(`/spot/${slug}`);
    }

    const resetRoute = locationType === "route"
        ? (<Button
            style="primary"
            className="my-auto order-1 bg-bg-main text-text"
            onClick={() => {
                setRouteCoords({ start: null, end: null });
                setRoutes([]);
                setSpotCoordinates(null);
            }
            }>
            <MapPinX width={20} /> Reset
        </Button>)
        : ""

    return (
        <>
            <Header style="map" />
            <main className="w-full h-full p-2 lg:px-4 flex items-center">
                {profile && center &&
                    <div className="absolute w-screen right-0 h-full z-0 top-0">
                        <Map center={center} zoom={14} trackUser={trackUser} other={resetRoute}>
                            <ReCenterMap lat={center[0]} lon={center[1]} />
                            {confirmedLocationType &&
                                <>
                                    {locationType === "point" && <CoordinatePickerPoint onPick={(lat, lon) => setSpotCoordinates([{ lat, lon }])} />}
                                    {locationType === "route" && routes.length === 0 && <CoordinatePickerRoute onPick={handleRoutePick} routeCoords={routeCoords} />}
                                </>
                            }
                            <UserMarker profile={profile} center={center} />
                            {spotCoordinates &&
                                <Marker position={[spotCoordinates[0].lat, spotCoordinates[0].lon]} />
                            }
                            {routeCoords.start && routes.length === 0 && <Marker position={[routeCoords.start.lat, routeCoords.start.lon]} />}
                            {routeCoords.end && <Marker position={[routeCoords.end.lat, routeCoords.end.lon]} />}
                            {routes.map((route, i) => (
                                <RouteDisplay
                                    key={i}
                                    data={route.coordinates}
                                    selected={selectedRoute === i}
                                    onSelect={() => setSelectedRoute(i)}
                                />
                            ))}


                        </Map>
                    </div>
                }
                {!confirmedLocationType &&
                    <LocationTypeForm locationType={locationType} setLocationType={setLocationType} onSubmit={handleSetLocationType} />
                }
                {confirmedLocationType &&
                    <AddSpotForm
                        center={center!}
                        locationType={locationType}
                        spotCoordinates={spotCoordinates}
                        setSpotCoordinates={setSpotCoordinates}
                        onSubmit={addSpot}
                    />
                }
            </main>
        </>
    )
}