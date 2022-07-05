import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.ExperimentResultCreateArgs>({
  experimentResult: {
    one: {
      data: {
        type: 4722938,
        experimentId: 1871892,
        collectionId: 8841385,
        suiteId: 4997425,
        caseId: 3530890,
        thread: 4492530,
        loop: 9869687,
      },
    },
    two: {
      data: {
        type: 9849087,
        experimentId: 5121046,
        collectionId: 9495591,
        suiteId: 2581857,
        caseId: 994897,
        thread: 2787982,
        loop: 4232741,
      },
    },
  },
})

export type StandardScenario = typeof standard
