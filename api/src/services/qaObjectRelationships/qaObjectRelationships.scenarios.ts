import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.QaObjectRelationshipCreateArgs>({
  qaObjectRelationship: {
    one: { data: { parentId: 4652712, childrenId: 9467727 } },
    two: { data: { parentId: 6530990, childrenId: 3981797 } },
  },
})

export type StandardScenario = typeof standard
