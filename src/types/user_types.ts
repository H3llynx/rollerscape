import type { SkatingStyle, SkillLevel, SpotType } from "../features/profile/config/user_info";

export type UserProfile = {
  id: string;
  name: string;
  avatar_url: string;
  updated_at: string;
  home_country_code: string
  home_lat: number | null
  home_location_name: string | null
  home_lon: number | null
  skill_level?: SkillLevel;
  skating_style?: SkatingStyle[];
  preferred_spot_types?: SpotType[];
}

export type Credentials = {
  name?: string;
  email: string;
  password: string;
}