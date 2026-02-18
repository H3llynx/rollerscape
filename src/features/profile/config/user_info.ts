
export const SKILLS = [
    { value: "beginner", label: "Just starting out" },
    { value: "intermediate", label: "Cruise mode" },
    { value: "advanced", label: "Confident roller" },
    { value: "pro", label: "Pro moves" },
] as const;

export const SPOT_PREFERENCES = [
    { value: "skatepark", label: "🛹 Skateparks & Bowls" },
    { value: "bike_path", label: "🚲 Bike Paths" },
    { value: "greenway", label: "🌿 Greenways" },
    { value: "seafront", label: "🌊 Seafronts & Promenades" },
    { value: "urban", label: "🏙️ Urban spots" },
    { value: "park", label: "🌳 Park paths" },
] as const;

export const SKATING_STYLES = [
    { value: "cruising", label: "Cruising & Fitness" },
    { value: "artistic", label: "Artistic / Dance" },
    { value: "freestyle", label: "Aggressive / Freestyle" },
    { value: "dog_skating", label: "Dog Skating" }
] as const;

export type SkillLevel = typeof SKILLS[number]["value"];
export type SkatingStyle = typeof SKATING_STYLES[number]["value"];
export type SpotPreferences = typeof SPOT_PREFERENCES[number]["value"];

export const riderPreferencesErrors = {
    skill: "Failed to update your skills. Let's retry that trick!",
    spot_types: "Style didn't land. Retry?",
    skating_style: "Failed to update your spot preferences. One more go?"
} as const;