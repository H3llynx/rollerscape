export const SPOT_TYPES = [
    { id: 1, value: "skatepark", label: "Skatepark", img: `${import.meta.env.BASE_URL}spot_type_icons/skatepark.png` },
    { id: 2, value: "street_plaza", label: "Street & Plaza", img: `${import.meta.env.BASE_URL}spot_type_icons/street.png` },
    { id: 6, value: "smooth_flat", label: "Smooth Flat", img: `${import.meta.env.BASE_URL}spot_type_icons/smooth-flat.png` },
    { id: 5, value: "bike_path", label: "Bike Paths", img: `${import.meta.env.BASE_URL}spot_type_icons/bike-path.png` },
    { id: 3, value: "greenway", label: "Greenways", img: `${import.meta.env.BASE_URL}spot_type_icons/greenway.png` },
    { id: 4, value: "urban_cruising", label: "Urban Cruising", img: `${import.meta.env.BASE_URL}spot_type_icons/urban-cruising.png` },
] as const;

export const LOCATION_TYPE = ["point", "route"] as const;

export const TRAFFIC_LEVELS = [
    { id: 1, value: "always_quiet", label: "Always quiet" },
    { id: 3, value: "busy_peak_hours", label: "Busy at peak hours" },
    { id: 4, value: "busy_weekends", label: "Busy on weekends" },
    { id: 5, value: "busy_in_season", label: "Busy on season" },
    { id: 6, value: "unknown", label: "Unknown" },
] as const;

export const ROUTE_GEN_MODE = [
    { value: "map", label: "Create itinerary from the map" },
    { value: "gpx", label: "Upload GPX" },
] as const;

export const POSSIBLE_DUPE_THRESHOLD_METERS = 100;

export const spotFormFields = {
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
    },
    name: {
        db_key: "name",
        label: "Name",
        id: "spot-name",
        input_type: "text",
    },
    spot_types: {
        db_key: "spot_type",
        label: "Spot type",
        input_type: "checkbox",
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
    traffic_levels: {
        db_key: "traffic_levels",
        label: "How do you qualify the traffic level?",
        id: "spot-traffic_levels",
        input_type: "checkbox",
    },
    photos: {
        db_key: "photos",
        id: "spot-photo",
        input_type: "file",
    },
}

export const reviewFormFields = {
    score: {
        db_key: "rating",
        label: "Your vibe on this spot",
        id: "comment-rating",
        input_type: "number",
        min: 1,
        max: 5,
    },
    comment: {
        db_key: "comment",
        label: "Anything to add?",
        id: "comment-text",
    }
}