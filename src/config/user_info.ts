
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
    { value: "cruising", label: "Cruising & Fitness", img: `${import.meta.env.BASE_URL}style_icons/fitness.png` },
    { value: "artistic", label: "Artistic / Dance", img: `${import.meta.env.BASE_URL}style_icons/artistic.png` },
    { value: "freestyle", label: "Aggressive / Freestyle", img: `${import.meta.env.BASE_URL}style_icons/aggresive.png` },
    { value: "dog_skating", label: "Dog Skating", img: `${import.meta.env.BASE_URL}style_icons/dog_skating.png` }
] as const;