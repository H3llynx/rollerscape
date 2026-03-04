import type { Database } from "../types/database_types";
import type { JunctionInsert } from "../types/spots_types";
import supabase from "../utils/supabase";

export type Data = keyof Database["Tables"] | keyof Database["Views"]

export const fetchData = async <T>(table: Data, select: string) => {
    const { data, error } = await supabase
        .from(table)
        .select(select);
    return { data: data as T[] | null, error };
};

export const fetchDataById = async <T>(table: Data, select: string, id1: string, id2: string) => {
    const { data, error } = await supabase
        .from(table)
        .select(select)
        .eq(id1, id2)
        .single();
    return { data: data as T | null, error };
};

export const fetchManyById = async <T>(table: Data, select: string, id1: string, id2: string) => {
    const { data, error } = await supabase
        .from(table)
        .select(select)
        .eq(id1, id2)
    return { data: data as T | null, error };
};

export const updateData = async <T extends { id: string }>(updatedData: T, table: Data) => {
    const { data, error } = await supabase
        .from(table)
        .update(updatedData)
        .eq("id", updatedData.id)
        .select()
        .single();
    return { data, error };
};

export const deleteData = async (id: string, table: Data) => {
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

export const insertData = async <T>(table: Data, content: T) => {
    const { data, error } = await supabase
        .from(table)
        .insert(content);
    return { data, error }
}

export const insertDataWithJunctions = async (
    mainTable: Data,
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
    mainTable: Data,
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

        if (junction.values.length) {
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