
const spotPref = {
    skatepark: "skatepark",
    bikePath: "bike_path",
    greenway: "greenway",
    seafront: "seafront",
    urban: "urban",
    park: "park"
} as const;

export const SPOT_TYPES = [
    { value: "skatepark", label: "Skateparks", associated_user_preferences: spotPref.skatepark },
    { value: "bowl", label: "Bowls", associated_user_preferences: spotPref.skatepark },
    { value: "bike_path", label: "Bike Paths", associated_user_preferences: spotPref.bikePath },
    { value: "greenway", label: "Greenways", associated_user_preferences: spotPref.greenway },
    { value: "seafront", label: "Seafronts & Promenades", associated_user_preferences: spotPref.seafront },
    { value: "flatground", label: "Flat ground" },
    { value: "park", label: "Park paths", associated_user_preferences: spotPref.park },
    { value: "street", label: "Streets", associated_user_preferences: spotPref.urban, },
    { value: "dog_friendly", label: "Dog friendly" },
] as const;