import type { Database } from "../types/database_types";
import type { JunctionInsert } from "../types/spots_types";
import supabase from "../utils/supabase";

export type Table = keyof Database["Tables"]

export const fetchData = async<T>(table: Table, select: string) => {
    const { data, error } = await supabase
        .from(table)
        .select(select);
    return { data: data as T[] | null, error };
};

export const updateData = async <T extends { id: string }>(updatedData: T, table: Table) => {
    const { data, error } = await supabase
        .from(table)
        .update(updatedData)
        .eq("id", updatedData.id)
        .select()
        .single();
    return { data, error };
};

export const insertDataWithJunctions = async (
    mainTable: Table,
    values: Record<string, unknown>,
    junctions: JunctionInsert[]
) => {
    const { data, error } = await supabase
        .from(mainTable)
        .insert(values)
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
    return { data, error };
};