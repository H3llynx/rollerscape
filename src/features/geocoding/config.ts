export const countries = [
    { value: "es", label: "🇪🇸 Spain" },
    { value: "fr", label: "🇫🇷 France" },
    { value: "de", label: "🇩🇪 Germany" },
    { value: "it", label: "🇮🇹 Italy" },
    { value: "pt", label: "🇵🇹 Portugal" },
    { value: "nl", label: "🇳🇱 Netherlands" }
] as const

export const geolocationErrors = {
    1: "Location blocked! Enable access in your browser or search below.",
    2: "Can't find you! Try searching your spot manually.",
    3: "Location timeout! That took too long. Search manually instead.",
    coordinates_issue: 'Location issue! Please try with the "Use your current location button".'
} as const;

export const profileLocationUpdateError = "Your home location could not be set. Try again later."