import { router, publicProcedure } from '../_core/trpc'
import { z } from 'zod'
import { db } from '../db'
import { eq, desc } from 'drizzle-orm'
import { corridas_piloto, metricas_agregadas, despesas } from '../../drizzle/schema'

export const dashboardRouter = router({
  hoje: publicProcedure
    .input(z.object({ usuario_id: z.string() }))
    .query(async ({ input }) => {
      const corridas = await db
        .select()
        .from(corridas_piloto)
        .where(eq(corridas_piloto.usuario_id, input.usuario_id))
        .orderBy(desc(corridas_piloto.created_at))
        .limit(20)
      const metricas = await db
        .select()
        .from(metricas_agregadas)
        .where(eq(metricas_agregadas.usuario_id, input.usuario_id))
        .limit(1)
      const gastos = await db
        .select()
        .from(despesas)
        .where(eq(despesas.usuario_id, input.usuario_id))
        .limit(50)
      return { corridas, metricas: metricas[0] ?? null, gastos }
    }),
})
