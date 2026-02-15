
export const SKILLS = [
    { value: "beginner", label: "Just starting out" },
    { value: "intermediate", label: "Cruise mode" },
    { value: "advanced", label: "Confident roller" },
    { value: "pro", label: "Pro moves" },
];
export const SPOT_TYPES = [
    { value: "street", label: "Street" },
    { value: "skate_park", label: "Skate Park" },
    { value: "bike_paths", label: "Bike Paths" },
    { value: "smooth_pavement", label: "Smooth pavement" }
];
export const SKATING_STYLES = [
    { value: "cruising", label: "Cruising & Fitness" },
    { value: "artistic", label: "Artistic / Dance" },
    { value: "freestyle", label: "Aggressive / Freestyle" },
    { value: "dog_skating", label: "Dog Skating" }
];

export type SkillLevel = typeof SKILLS[number]["value"];
export type SkatingStyle = typeof SKATING_STYLES[number]["value"];
export type SpotType = typeof SPOT_TYPES[number]["value"];

export const riderPreferencesErrors = {
    skill: "Failed to update your skills. Let's retry that trick!",
    spot_types: "Style didn't land. Retry?",
    skating_style: "Failed to update your spot preferences. One more go?"
} as const;