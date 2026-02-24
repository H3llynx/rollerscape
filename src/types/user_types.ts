import type { SkatingStyle, SkillLevel } from "../config/user_info";
import type { SpotType } from "./spots_types";

export type UserProfile = {
  id: string;
  name: string;
  avatar_url: string;
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