import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.QaObjectRelationshipCreateArgs>({
  qaObjectRelationship: {
    one: {
      data: {
        parent: {
          create: {
            name: 'String',
            updatedAt: '2022-06-17T10:40:16Z',
            type: { create: { name: 'String' } },
          },
        },
      },
    },
    two: {
      data: {
        parent: {
          create: {
            name: 'String',
            updatedAt: '2022-06-17T10:40:16Z',
            type: { create: { name: 'String' } },
          },
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
