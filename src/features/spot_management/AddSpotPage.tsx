import { ArrowLeft, ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router";
import { Button } from "../../components/Button/Button";
import { Dialog } from "../../components/Dialog/Dialog";
import { GridLeftPanel } from "../../components/GridLeftPanel/GridLeftPanel";
import { MobileHideButton } from "../../components/MobileHideButton/MobileHideButton";
import { databases } from "../../config/databases";
import { spotErrors } from "../../config/errors";
import { spotFormFields } from "../../config/spots";
import { redirecttoSpotUrl } from "../../config/urls";
import { insertDataWithJunctions } from "../../services/data";
import { reverseGeocode } from "../../services/geolocation";
import { getSpotTypes, getTrafficLevels } from "../../services/spots";
import type { Coordinates, Route } from "../../types/geolocation_types";
import type { JunctionInsert, RouteGenMode, Spot, SpotType, TrafficLevel } from "../../types/spots_types";
import { createSlug } from "../../utils/helpers";
import { useCenter } from "../map/hooks/useCenter";
import { usePanelSize, useSpots } from "../map/hooks/useContexts";
import { AddSpotMap } from "./components/AddSpotMap/AddSpotMap";
import { LocationTypeForm } from "./components/LocationTypeForm/LocationTypeForm";
import { MapsToCoordsForm } from "./components/MapsToCoordsForm/MapsToCoordsForm";
import { SpotForm } from "./components/SpotForm/SpotForm";
import { estimateDistanceFromCoords } from "./utils";

export function AddSpotPage() {
    const { center, profile } = useCenter();
    const { loadSpots } = useSpots();
    const { name, location_type, coordinates, description, surface_quality, spot_types, traffic_levels, photos } = spotFormFields;
    const { setValue } = useForm();
    const navigate = useNavigate();
    const [confirmedLocationType, setConfirmedLocationType] = useState<boolean>(false);
    const [locationType, setLocationType] = useState<Spot["location_type"]>(location_type.options[0] as Spot["location_type"]);
    const [routeGenMode, setRouteGenMode] = useState<RouteGenMode | null>(null);
    const [spotCoordinates, setSpotCoordinates] = useState<Coordinates[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<number>(0);
    const [gpxCoordinates, setGpxCoordinates] = useState<Coordinates[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [custom, setCustom] = useState<boolean>(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const customDistanceRef = useRef<number>(0);
    const isDesktop = useMediaQuery({ minWidth: 1024 });
    const instructionsRef = useRef<HTMLParagraphElement>(null);
    const { textSmaller, setTextSmaller } = usePanelSize();

    useEffect(() => {
        if (error) {
            dialogRef.current?.showModal();
        }
    }, [error]);

    useEffect(() => {
        if (locationType && locationType === "route")
            setTextSmaller(true);
        if (routes.length) setTextSmaller(false)
    }, [locationType, routes]);

    useEffect(() => {
        if (!isDesktop && locationType === "point" && spotCoordinates.length) {
            instructionsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [isDesktop, locationType, spotCoordinates.length]);

    const handleClose = () => {
        dialogRef.current?.close();
        setError(null);
    };

    const handleSetLocationType = () => {
        setLocationType(locationType);
        setConfirmedLocationType(true);
        setValue(location_type.db_key, locationType);
        if (gpxCoordinates) setSpotCoordinates(gpxCoordinates);
    };

    const getRouteLength = () => {
        if (locationType !== "route") return;
        if (gpxCoordinates) return estimateDistanceFromCoords(gpxCoordinates);
        return custom
            ? customDistanceRef.current
            : Number((routes[selectedRoute].distance / 1000).toFixed(2));
    };

    const addSpot = async (newSpot: Record<string, unknown>) => {
        if (!profile) return;
        if (!spotCoordinates.length) {
            setError(spotErrors.add.missing_coordinates);
            return
        }
        const selectedLevels = newSpot[traffic_levels.db_key] as TrafficLevel[];
        const selectedTypes = newSpot[spot_types.db_key] as SpotType[];
        const coords = newSpot[coordinates.db_key] as Coordinates[];
        const geo = await reverseGeocode(coords[0]);
        const slug = createSlug(`${newSpot[name.db_key]}-${geo.city}`);
        const { data: typeRows } = await getSpotTypes(selectedTypes);
        const { data: levelRows } = await getTrafficLevels(selectedLevels);

        const values = {
            name: newSpot[name.db_key],
            description: newSpot[description.db_key] || null,
            location_type: locationType,
            coordinates: coords,
            length_km: getRouteLength(),
            surface_quality: newSpot[surface_quality.db_key],
            city: geo.city,
            country: geo.country,
            address: geo.name,
            photos: newSpot[photos.db_key as keyof Spot] as string[] || [],
            slug,
            created_by: profile.id,
        }

        const junctions: JunctionInsert[] = [
            { table: "spot_spot_types", fKey: "spot_type_id", values: typeRows?.map(row => row.id) ?? [] },
            { table: "spot_traffic_levels", fKey: "traffic_level_id", values: levelRows?.map(row => row.id) ?? [] }
        ]

        const { error } = await insertDataWithJunctions(databases.spots, values, junctions);
        if (error) {
            setError(spotErrors.add.generic)
            return
        }
        await loadSpots();
        navigate(redirecttoSpotUrl(slug));
    }

    return (
        <>
            {profile && center &&
                <GridLeftPanel collapsed={!confirmedLocationType} textSmaller={textSmaller}>
                    <div className="left-panel scroll">
                        {confirmedLocationType &&
                            <>
                                <MobileHideButton />
                                <div className="p-2 md:px-1 lg:px-2">
                                    <div className="flex gap-0.5 justify-between items-center pb-1 md:pb-2">
                                        <h1>Add a new {locationType === "route" ? "route" : "spot"}</h1>
                                        <Button style="collapsed" className="ml-auto" onClick={() => setConfirmedLocationType(false)}><ArrowLeft aria-hidden /><span>Back</span></Button>
                                        <Button style="icon" className="text-grey" aria-label="Cancel" onClick={() => navigate("/")}><X aria-hidden /></Button>
                                    </div>
                                    <div className="form-info slight-shadow" ref={instructionsRef}>
                                        <span className="text-text-secondary">
                                            {isDesktop &&
                                                <span className="inline-flex items-end justify-center font-bold w-2 h-2 border-2 rounded-full mr-0.5">1</span>}
                                            {locationType === "route"
                                                ? "Click two points on the map to get route suggestions, or draw your custom itinerary."
                                                : "Pin your skate spot on the map"
                                            }
                                        </span>
                                        {locationType === "point" &&
                                            <>
                                                <p className="separator font-main">OR</p>
                                                <MapsToCoordsForm setSpotCoordinates={setSpotCoordinates} />
                                            </>
                                        }
                                        {spotCoordinates.length > 0 &&
                                            <span className="animate-[appear_1s_ease-in-out_forwards]">
                                                {isDesktop &&
                                                    <span className="inline-flex items-end justify-center font-bold w-2 h-2 border-2 rounded-full mr-0.5">2</span>}
                                                Add all the details below <ChevronDown className="inline cursor-default" />
                                            </span>
                                        }
                                    </div>
                                    <SpotForm
                                        isAdding
                                        spotCoordinates={spotCoordinates}
                                        onSubmit={addSpot}
                                    />
                                </div>
                            </>
                        }
                    </div>
                    <AddSpotMap
                        locationType={locationType}
                        confirmedLocationType={confirmedLocationType}
                        spotCoordinates={spotCoordinates}
                        setSpotCoordinates={setSpotCoordinates}
                        routes={routes}
                        setRoutes={setRoutes}
                        selectedRoute={selectedRoute}
                        setSelectedRoute={setSelectedRoute}
                        gpxCoordinates={gpxCoordinates}
                        custom={custom}
                        setCustom={setCustom}
                        customDistanceRef={customDistanceRef}
                    />
                </GridLeftPanel>
            }
            {!confirmedLocationType &&
                <LocationTypeForm
                    locationType={locationType}
                    routeGenMode={routeGenMode}
                    setLocationType={setLocationType}
                    setRouteGenMode={setRouteGenMode}
                    setGpxCoordinates={setGpxCoordinates}
                    onSubmit={handleSetLocationType}
                />
            }
            <Dialog ref={dialogRef} style="error" close={handleClose}>
                <p>{error}</p>
            </Dialog>
        </>
    )
}