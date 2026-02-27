export type Database = {
    Tables: {
        comments: {
            Row: {
                comment: string | null
                created_at: string | null
                id: string
                rating: number | null
                spot_id: string | null
                user_id: string | null
            }
            Insert: {
                comment?: string | null
                created_at?: string | null
                id?: string
                rating?: number | null
                spot_id?: string | null
                user_id?: string | null
            }
            Update: {
                comment?: string | null
                created_at?: string | null
                id?: string
                rating?: number | null
                spot_id?: string | null
                user_id?: string | null
            }
            Relationships: [
                {
                    foreignKeyName: "comments_spot_id_fkey"
                    columns: ["spot_id"]
                    isOneToOne: false
                    referencedRelation: "public_spots"
                    referencedColumns: ["id"]
                },
                {
                    foreignKeyName: "comments_spot_id_fkey"
                    columns: ["spot_id"]
                    isOneToOne: false
                    referencedRelation: "spots"
                    referencedColumns: ["id"]
                },
            ]
        },
        favorites: {
            Row: {
                profile_id: string
                spot_id: string
            }
            Insert: {
                profile_id: string
                spot_id: string
            }
            Update: {
                profile_id?: string
                spot_id?: string
            }
            Relationships: [
                {
                    foreignKeyName: "favorites_spot_id_fkey"
                    columns: ["spot_id"]
                    isOneToOne: false
                    referencedRelation: "public_spots"
                    referencedColumns: ["id"]
                },
                {
                    foreignKeyName: "favorites_spot_id_fkey"
                    columns: ["spot_id"]
                    isOneToOne: false
                    referencedRelation: "spots"
                    referencedColumns: ["id"]
                },
                {
                    foreignKeyName: "favorites_user_id_fkey"
                    columns: ["profile_id"]
                    isOneToOne: false
                    referencedRelation: "profiles"
                    referencedColumns: ["id"]
                },
                {
                    foreignKeyName: "favorites_user_id_fkey"
                    columns: ["profile_id"]
                    isOneToOne: false
                    referencedRelation: "public_rider"
                    referencedColumns: ["id"]
                },
            ]
        }
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
                    referencedRelation: "public_spots"
                    referencedColumns: ["id"]
                },
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
                    referencedRelation: "public_spots"
                    referencedColumns: ["id"]
                },
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
                name: string | null
            }
            Insert: {
                id?: number
                name?: string | null
            }
            Update: {
                id?: number
                name?: string | null
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
                id: string
                length_km: number | null
                location_type: string | null
                name: string
                photos: string[] | null
                slug: string
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
                id?: string
                length_km?: number | null
                location_type?: string | null
                name: string
                photos?: string[] | null
                slug: string
                surface_quality?: number | null
            }
            Update: {
                address?: string | null
                average_rating?: number | null
                city?: string
                coordinates?: JSON
                country?: string
                created_by?: string | null
                description?: string | null
                id?: string
                length_km?: number | null
                location_type?: string | null
                name?: string
                photos?: string[] | null
                slug?: string
                surface_quality?: number | null
            }
            Relationships: [
                {
                    foreignKeyName: "spots_created_by_fkey"
                    columns: ["created_by"]
                    isOneToOne: false
                    referencedRelation: "profiles"
                    referencedColumns: ["id"]
                },
                {
                    foreignKeyName: "spots_created_by_fkey"
                    columns: ["created_by"]
                    isOneToOne: false
                    referencedRelation: "public_rider"
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
    },
    Views: {
        public_comments: {
            Row: {
                comment: string | null
                commenter_profile: JSON | null
                created_at: string | null
                id: string | null
                rating: number | null
                spot_id: string | null
                user_id: string | null
            }
            Relationships: [
                {
                    foreignKeyName: "comments_spot_id_fkey"
                    columns: ["spot_id"]
                    isOneToOne: false
                    referencedRelation: "public_spots"
                    referencedColumns: ["id"]
                },
                {
                    foreignKeyName: "comments_spot_id_fkey"
                    columns: ["spot_id"]
                    isOneToOne: false
                    referencedRelation: "spots"
                    referencedColumns: ["id"]
                },
            ]
        }
        public_rider: {
            Row: {
                avatar_url: string | null
                id: string | null
                name: string | null
                skating_style: string[] | null
            }
            Insert: {
                avatar_url?: string | null
                id?: string | null
                name?: string | null
                skating_style?: string[] | null
            }
            Update: {
                avatar_url?: string | null
                id?: string | null
                name?: string | null
                skating_style?: string[] | null
            }
            Relationships: []
        }
        public_spots: {
            Row: {
                address: string | null
                average_rating: number | null
                city: string | null
                coordinates: JSON | null
                country: string | null
                created_by: string | null
                creator_profile: JSON | null
                description: string | null
                id: string | null
                length_km: number | null
                location_type: string | null
                name: string | null
                photos: string[] | null
                slug: string | null
                spot_types: JSON | null
                surface_quality: number | null
                traffic_levels: JSON | null
            }
            Relationships: [
                {
                    foreignKeyName: "spots_created_by_fkey"
                    columns: ["created_by"]
                    isOneToOne: false
                    referencedRelation: "profiles"
                    referencedColumns: ["id"]
                },
                {
                    foreignKeyName: "spots_created_by_fkey"
                    columns: ["created_by"]
                    isOneToOne: false
                    referencedRelation: "public_rider"
                    referencedColumns: ["id"]
                },
            ]
        }
    }
}