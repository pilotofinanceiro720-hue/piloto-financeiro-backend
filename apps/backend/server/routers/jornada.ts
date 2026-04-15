import { router, publicProcedure } from '../_core/trpc'
import { z } from 'zod'
import { db } from '../db'
import { eq } from 'drizzle-orm'
import { jornadas_turno } from '../../drizzle/schema'

export const jornadaRouter = router({
  ativa: publicProcedure
    .input(z.object({ usuario_id: z.string() }))
    .query(async ({ input }) => {
      const rows = await db
        .select()
        .from(jornadas_turno)
        .where(eq(jornadas_turno.usuario_id, input.usuario_id))
        .limit(1)
      return rows[0] ?? null
    }),
  iniciar: publicProcedure
    .input(z.object({ usuario_id: z.string(), plataforma: z.string() }))
    .mutation(async ({ input }) => {
      const rows = await db.insert(jornadas_turno).values({
        usuario_id: input.usuario_id,
        plataforma: input.plataforma,
        iniciado_em: new Date(),
      }).returning()
      return rows[0]
    }),
  encerrar: publicProcedure
    .input(z.object({ jornada_id: z.number(), ganho_bruto: z.number(), corridas_aceitas: z.number(), km_rodados: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .update(jornadas_turno)
        .set({
          encerrado_em: new Date(),
          ganho_bruto: input.ganho_bruto,
          corridas_aceitas: input.corridas_aceitas,
          km_rodados: input.km_rodados,
        })
        .where(eq(jornadas_turno.id, input.jornada_id))
      return { ok: true }
    }),
})
