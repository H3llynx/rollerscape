export const SPOT_TYPES = [
    { value: "skatepark", label: "Skateparks" },
    { value: "bowl", label: "Bowls" },
    { value: "bike_path", label: "Bike Paths" },
    { value: "greenway", label: "Greenways" },
    { value: "smooth_flat", label: "Smooth Flat" },
    { value: "street", label: "Street" },
] as const;

export const LOCATION_TYPE = ["point", "route"] as const;

export const TRAFFIC_LEVELS = [
    { value: "always_quiet", label: "Always quiet" },
    { value: "busy_peak_hours", label: "Busy at peak hours" },
    { value: "busy_weekends", label: "Busy on weekends" },
    { value: "busy_in_season", label: "Busy on season" },
    { value: "unknown", label: "Unknown" }
] as const;

export const ROUTE_GEN_MODE = [
    { value: "map", label: "Create itinerary from the map" },
    { value: "gpx", label: "Upload GPX" },
] as const;

export const addSpotFields = {
    location_type: {
        db_key: "location_type",
        id: "spot-location-type",
        label: "Pick a location type",
        options: LOCATION_TYPE
    },
    route_gen_mode: {
        id: "route_gen",
        label: "How do you want to generate the route?",
        options: ROUTE_GEN_MODE
    },
    gpx: {
        id: "gpx-id",
        input_type: "file",
    },
    coordinates: {
        db_key: "coordinates",
        id1: "spot-lat",
        id2: "spot-lon",
        label0: "Click on the map to set the coordinates",
        label1: "Latitude",
        label2: "Longitude",
        input_type: "number"
    },
    name: {
        db_key: "name",
        label: "Name",
        id: "spot-name",
        input_type: "text",
    },
    spot_types: {
        db_key: "spot_type",
        label: "Spot type (select all that apply)",
    },
    description: {
        db_key: "description",
        label: "Description",
        id: "spot-description"
    },
    surface_quality: {
        db_key: "surface_quality",
        label: "How do you qualify the surface quality?",
        id: "spot-surface-quality",
        input_type: "number",
        min: 1,
        max: 5
    },
    traffic_level: {
        db_key: "traffic_level",
        id: "spot-traffic_level",
        label: "How do you qualify the traffic level?",
        options: TRAFFIC_LEVELS
    },
    photos: {
        db_key: "photos",
        id: "spot-photo",
        input_type: "file",
    },
}