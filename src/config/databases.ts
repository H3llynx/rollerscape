export const databases = {
    profiles: "profiles",
    spots: "spots",
    spot_types: "spot_types",
    traffic_levels: "traffic_levels",
    favorites: "favorites",
} as const

export const dbSelect = {
    all: "*",
    spots: {
        allWithJunctions: `
                *,
                spot_spot_types(
                    ...spot_types(id, name)
                ),
                spot_traffic_levels(
                    ...traffic_levels(id, name)
                )
            `,
    }
}

export const views = {
    public_rider: "public_rider",
}