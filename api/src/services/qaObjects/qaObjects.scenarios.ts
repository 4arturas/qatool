import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.QaObjectCreateArgs>({
  qaObject: {
    one: {
      data: {
        name: 'String',
        updatedAt: '2022-06-17T05:52:46Z',
        type: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        name: 'String',
        updatedAt: '2022-06-17T05:52:46Z',
        type: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = typeof standard
