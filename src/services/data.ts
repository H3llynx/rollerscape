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

export const fetchDataById = async <T>(table: Table, select: string, id: string) => {
    const { data, error } = await supabase
        .from(table)
        .select(select)
        .eq("id", id)
        .single();
    return { data: data as T | null, error };
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

export const deleteData = async (id: string, table: Table) => {
    try {
        const { data, error } = await supabase
            .from(table)
            .delete()
            .eq("id", id)
        return { data, error };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`${table} update error: ${error} | id: ${id} not deleted`);
        return { data: null, error };
    }
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

export const updateDataWithJunctions = async (
    mainTable: Table,
    id: string | number,
    values: Record<string, unknown>,
    junctions: JunctionInsert[]
) => {
    const { data, error } = await supabase
        .from(mainTable)
        .update(values)
        .eq("id", id)
        .select("id")
        .single();

    if (error || !data) return { data: null, error };

    for (const junction of junctions) {
        await supabase
            .from(junction.table)
            .delete()
            .eq("spot_id", data.id);

        if (junction.values.length > 0) {
            await supabase.from(junction.table).insert(
                junction.values.map(id => ({
                    spot_id: data.id,
                    [junction.fKey]: id
                }))
            );
        }
    }

    return { data, error };
};