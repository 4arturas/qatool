import {
  qaObjectRelationships,
  qaObjectRelationship,
  createQaObjectRelationship,
  updateQaObjectRelationship,
  deleteQaObjectRelationship,
} from './qaObjectRelationships'
import type { StandardScenario } from './qaObjectRelationships.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('qaObjectRelationships', () => {
  scenario(
    'returns all qaObjectRelationships',
    async (scenario: StandardScenario) => {
      const result = await qaObjectRelationships()

      expect(result.length).toEqual(
        Object.keys(scenario.qaObjectRelationship).length
      )
    }
  )

  scenario(
    'returns a single qaObjectRelationship',
    async (scenario: StandardScenario) => {
      const result = await qaObjectRelationship({
        id: scenario.qaObjectRelationship.one.id,
      })

      expect(result).toEqual(scenario.qaObjectRelationship.one)
    }
  )

  scenario(
    'creates a qaObjectRelationship',
    async (scenario: StandardScenario) => {
      const result = await createQaObjectRelationship({
        input: { parentId: scenario.qaObjectRelationship.two.parentId },
      })

      expect(result.parentId).toEqual(
        scenario.qaObjectRelationship.two.parentId
      )
    }
  )

  scenario(
    'updates a qaObjectRelationship',
    async (scenario: StandardScenario) => {
      const original = await qaObjectRelationship({
        id: scenario.qaObjectRelationship.one.id,
      })
      const result = await updateQaObjectRelationship({
        id: original.id,
        input: { parentId: scenario.qaObjectRelationship.two.parentId },
      })

      expect(result.parentId).toEqual(
        scenario.qaObjectRelationship.two.parentId
      )
    }
  )

  scenario(
    'deletes a qaObjectRelationship',
    async (scenario: StandardScenario) => {
      const original = await deleteQaObjectRelationship({
        id: scenario.qaObjectRelationship.one.id,
      })
      const result = await qaObjectRelationship({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
