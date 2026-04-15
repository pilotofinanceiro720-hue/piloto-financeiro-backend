import { router, publicProcedure } from '../_core/trpc'
import { z } from 'zod'
import { db } from '../db'
import { eq } from 'drizzle-orm'
import { overlay_criterios } from '../../drizzle/schema'

export const overlayRouter = router({
  getCriterios: publicProcedure
    .input(z.object({ usuario_id: z.string() }))
    .query(async ({ input }) => {
      const rows = await db
        .select()
        .from(overlay_criterios)
        .where(eq(overlay_criterios.usuario_id, input.usuario_id))
        .limit(1)
      return rows[0] ?? {
        rspkm_minimo: 1.30,
        rsphora_minimo: 50,
        valor_minimo: 10,
        km_maximo_busca: 2.0,
        plataformas_ativas: ['uber', '99'],
      }
    }),
  setCriterios: publicProcedure
    .input(z.object({
      usuario_id: z.string(),
      rspkm_minimo: z.number(),
      rsphora_minimo: z.number(),
      valor_minimo: z.number(),
      km_maximo_busca: z.number(),
      plataformas_ativas: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      const exists = await db
        .select()
        .from(overlay_criterios)
        .where(eq(overlay_criterios.usuario_id, input.usuario_id))
        .limit(1)
      if (exists.length > 0) {
        await db
          .update(overlay_criterios)
          .set(input)
          .where(eq(overlay_criterios.usuario_id, input.usuario_id))
      } else {
        await db.insert(overlay_criterios).values(input)
      }
      return { ok: true }
    }),
})
