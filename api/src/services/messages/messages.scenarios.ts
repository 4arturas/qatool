import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.MessageCreateArgs>({
  message: {
    one: { data: { type: 7238534 } },
    two: { data: { type: 7047449 } },
  },
})

export type StandardScenario = typeof standard
