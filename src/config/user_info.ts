
export const COUNTRIES = [
    { value: "es", label: "🇪🇸 Spain" },
    { value: "fr", label: "🇫🇷 France" },
    { value: "de", label: "🇩🇪 Germany" },
    { value: "it", label: "🇮🇹 Italy" },
    { value: "pt", label: "🇵🇹 Portugal" },
    { value: "nl", label: "🇳🇱 Netherlands" }
] as const

export const SKILLS = [
    { value: "beginner", label: "Just starting out" },
    { value: "intermediate", label: "Cruise mode" },
    { value: "advanced", label: "Confident roller" },
    { value: "pro", label: "Pro moves" },
] as const;

export const SKATING_STYLES = [
    { value: "cruising", label: "Cruising & Fitness" },
    { value: "artistic", label: "Artistic / Dance" },
    { value: "freestyle", label: "Aggressive / Freestyle" },
    { value: "dog_skating", label: "Dog Skating" }
] as const;