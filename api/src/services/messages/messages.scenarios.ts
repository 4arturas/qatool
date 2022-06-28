import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.MessageCreateArgs>({
  message: {
    one: { data: { type: 2530397 } },
    two: { data: { type: 2573786 } },
  },
})

export type StandardScenario = typeof standard
