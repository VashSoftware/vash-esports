alter table "public"."user_profiles" alter column "picture_url" drop default;

alter table "public"."user_profiles" alter column "picture_url" drop not null;

CREATE UNIQUE INDEX platforms_name_key ON public.platforms USING btree (name);

alter table "public"."platforms" add constraint "platforms_name_key" UNIQUE using index "platforms_name_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_closest_map_pool_id(average_star_rating real)
 RETURNS real
 LANGUAGE plpgsql
AS $function$DECLARE
    closest_avg_star_rating float4;
    closest_map_pool_id int;
BEGIN
    SELECT 
        mp.id,
        AVG(m.star_rating) AS average_star_rating
    INTO 
        closest_map_pool_id,
        closest_avg_star_rating
    FROM 
        map_pools mp
    JOIN 
        map_pool_maps mpm ON mp.id = mpm.map_pool_id
    JOIN 
        maps m ON mpm.map_id = m.id
    GROUP BY 
        mp.id
    ORDER BY 
        ABS(AVG(m.star_rating) - closest_avg_star_rating)
    LIMIT 1;

    RETURN closest_map_pool_id;
END;$function$
;


