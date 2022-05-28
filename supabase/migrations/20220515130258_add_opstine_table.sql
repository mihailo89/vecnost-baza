-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.opstina
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name text COLLATE pg_catalog."default",
    okrug_id smallint,
    CONSTRAINT opstina_pkey PRIMARY KEY (id),
    CONSTRAINT opstina_id_key UNIQUE (id),
    CONSTRAINT opstina_okrug_id_fkey FOREIGN KEY (okrug_id)
        REFERENCES public.okrug (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.opstina
    OWNER to postgres;

ALTER TABLE IF EXISTS public.opstina
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.opstina TO anon;

GRANT ALL ON TABLE public.opstina TO authenticated;

GRANT ALL ON TABLE public.opstina TO postgres;

GRANT ALL ON TABLE public.opstina TO service_role;

COMMENT ON TABLE public.opstina
    IS 'Opstine';

CREATE POLICY "Enable access to all users"
    ON public.opstina
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true);