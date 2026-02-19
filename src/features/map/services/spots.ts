import supabase from "../../../utils/supabase";

export const fetchSpots = async () => {
    try {
        const { data, error } = await supabase
            .from('spots')
            .select(`
                *,
                spot_spot_types(
                    spot_types(id, name)
                )
            `);
        return { data, error };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`spots fetch error: ${error}`);
        return { data: null, error };
    }
};