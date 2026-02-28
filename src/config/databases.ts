export const databases = {
    profiles: "profiles",
    spots: "spots",
    spot_types: "spot_types",
    traffic_levels: "traffic_levels",
    favorites: "favorites",
    comments: "comments"
} as const

export const views = {
    public_spots: "public_spots",
    public_comments: "public_comments",
    public_rider: "public_rider",
} as const

export const dbSelect = {
    spots: {
        allWithJunctions: `*,
spot_spot_types(
    ...spot_types(id, name)
),
spot_traffic_levels(
    ...traffic_levels(id, name)
)`
    }
}

