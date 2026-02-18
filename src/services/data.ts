import type { Database } from "../types/database_types";
import type { UserProfile } from "../types/user_types";
import supabase from "../utils/supabase";

type Table = keyof Database["Tables"]

export const fetchData = async (table: Table) => {
    try {
        const { data, error } = await supabase
            .from(table)
            .select("*");
        return { data, error };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`${table} fetch error: ${error}`);
        return { data: null, error };
    }
};

export const updateData = async (updatedData: UserProfile, table: Table) => {
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