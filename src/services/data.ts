import type { Database } from "../types/database_types";
import type { UserProfile } from "../types/user_types";
import supabase from "../utils/supabase";

export type Table = keyof Database["Tables"]

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

type JunctionInsert = {
    table: Table;
    fKey: string;
    values: number[];
}

export const insertDataWithJunctions = async (
    mainTable: Table,
    mainData: Record<string, unknown>,
    junctions: JunctionInsert[]
) => {
    try {
        const { data, error } = await supabase
            .from(mainTable)
            .insert(mainData)
            .select("id")
            .single();

        if (error || !data) return { data: null, error };

        for (const junction of junctions) {
            await supabase.from(junction.table).insert(
                junction.values.map(id => ({
                    spot_id: data.id,
                    [junction.fKey]: id
                }))
            );
        }

        return { data, error: null };
    } catch (error) {
        console.error(`Insert error on ${mainTable}: ${error}`);
        return { data: null, error: error };
    }
};