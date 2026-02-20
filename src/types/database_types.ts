export type Database = {
    Tables: {
        profiles: {
            Row: {
                avatar_url: string | null
                home_country_code: string | null
                home_lat: number | null
                home_location_name: string | null
                home_lon: number | null
                id: string
                name: string | null
                preferred_spot_types: string[] | null
                skating_style: string[] | null
                skill_level: string | null
                updated_at: string | null
            }
            Insert: {
                avatar_url?: string | null
                home_country_code?: string | null
                home_lat?: number | null
                home_location_name?: string | null
                home_lon?: number | null
                id: string
                name?: string | null
                preferred_spot_types?: string[] | null
                skating_style?: string[] | null
                skill_level?: string | null
                updated_at?: string | null
            }
            Update: {
                avatar_url?: string | null
                home_country_code?: string | null
                home_lat?: number | null
                home_location_name?: string | null
                home_lon?: number | null
                id?: string
                name?: string | null
                preferred_spot_types?: string[] | null
                skating_style?: string[] | null
                skill_level?: string | null
                updated_at?: string | null
            }
            Relationships: []
        }
        spot_spot_types: {
            Row: {
                spot_id: string
                spot_type_id: number
            }
            Insert: {
                spot_id: string
                spot_type_id: number
            }
            Update: {
                spot_id?: string
                spot_type_id?: number
            }
            Relationships: [
                {
                    foreignKeyName: "spot_spot_types_spot_id_fkey"
                    columns: ["spot_id"]
                    isOneToOne: false
                    referencedRelation: "spots"
                    referencedColumns: ["id"]
                },
                {
                    foreignKeyName: "spot_spot_types_spot_type_id_fkey"
                    columns: ["spot_type_id"]
                    isOneToOne: false
                    referencedRelation: "spot_types"
                    referencedColumns: ["id"]
                },
            ]
        }
        spot_traffic_levels: {
            Row: {
                spot_id: string
                traffic_level_id: number
            }
            Insert: {
                spot_id: string
                traffic_level_id: number
            }
            Update: {
                spot_id?: string
                traffic_level_id?: number
            }
            Relationships: [
                {
                    foreignKeyName: "spot_traffic_levels_spot_id_fkey"
                    columns: ["spot_id"]
                    isOneToOne: false
                    referencedRelation: "spots"
                    referencedColumns: ["id"]
                },
                {
                    foreignKeyName: "spot_traffic_levels_traffic_level_id_fkey"
                    columns: ["traffic_level_id"]
                    isOneToOne: false
                    referencedRelation: "traffic_levels"
                    referencedColumns: ["id"]
                },
            ]
        }
        spot_types: {
            Row: {
                id: number
                type: string | null
            }
            Insert: {
                id?: number
                type?: string | null
            }
            Update: {
                id?: number
                type?: string | null
            }
            Relationships: []
        }
        spots: {
            Row: {
                address: string | null
                average_rating: number | null
                city: string
                coordinates: JSON
                country: string
                created_by: string | null
                description: string | null
                display_lat: number | null
                display_lon: number | null
                has_obstacles: boolean | null
                id: string
                length_km: number | null
                location_type: string | null
                name: string
                photos: string[] | null
                surface_quality: number | null
            }
            Insert: {
                address?: string | null
                average_rating?: number | null
                city: string
                coordinates: JSON
                country: string
                created_by?: string | null
                description?: string | null
                display_lat?: number | null
                display_lon?: number | null
                has_obstacles?: boolean | null
                id?: string
                length_km?: number | null
                location?: unknown
                location_type?: string | null
                name: string
                photos?: string[] | null
                surface_quality?: number | null
                traffic_level?: string | null
            }
            Update: {
                address?: string | null
                average_rating?: number | null
                city?: string
                coordinates?: JSON
                country?: string
                created_by?: string | null
                description?: string | null
                display_lat?: number | null
                display_lon?: number | null
                has_obstacles?: boolean | null
                id?: string
                length_km?: number | null
                location?: unknown
                location_type?: string | null
                name?: string
                photos?: string[] | null
                surface_quality?: number | null
                traffic_level?: string | null
            }
            Relationships: [
                {
                    foreignKeyName: "spots_created_by_fkey"
                    columns: ["created_by"]
                    isOneToOne: false
                    referencedRelation: "profiles"
                    referencedColumns: ["id"]
                },
            ]
        }
        traffic_levels: {
            Row: {
                id: number
                name: string
            }
            Insert: {
                id?: number
                name: string
            }
            Update: {
                id?: number
                name?: string
            }
            Relationships: []
        }
    }
};
