import type { Database } from "../types/database_types";
import type { UserProfile } from "../types/user_types";
import supabase from "../utils/supabase";


export const updateData = async (updatedData: UserProfile, table: keyof Database["Tables"]) => {
    try {
        const { data, error } = await supabase
            .from(table)
            .update(updatedData)
            .eq("id", updatedData.id)
            .select()
            .single();
        return { data, error };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`${table} update error: ${error} | id: ${updatedData.id} could not be updated`);
        return { data: null, error };
    }
};