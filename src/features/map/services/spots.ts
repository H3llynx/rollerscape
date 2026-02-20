import supabase from "../../../utils/supabase";

export const fetchSpots = async () => {
    try {
        const { data, error } = await supabase
            .from("spots")
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

export const fetchBySlug = async (slug: string) => {
    try {
        const { data, error } = await supabase
            .from("spots")
            .select(`
                *,
                spot_spot_types(
                    spot_types(id, name)
                )
            `)
            .eq("slug", slug)
            .single();
        return { data, error };
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`spot with slug ${slug} could not be loaded: ${error}`);
        return { data: null, error };
    }
}