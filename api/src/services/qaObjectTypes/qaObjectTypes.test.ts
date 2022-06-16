import {
  qaObjectTypes,
  qaObjectType,
  createQaObjectType,
  updateQaObjectType,
  deleteQaObjectType,
} from './qaObjectTypes'
import type { StandardScenario } from './qaObjectTypes.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('qaObjectTypes', () => {
  scenario('returns all qaObjectTypes', async (scenario: StandardScenario) => {
    const result = await qaObjectTypes()

    expect(result.length).toEqual(Object.keys(scenario.qaObjectType).length)
  })

  scenario(
    'returns a single qaObjectType',
    async (scenario: StandardScenario) => {
      const result = await qaObjectType({ id: scenario.qaObjectType.one.id })

      expect(result).toEqual(scenario.qaObjectType.one)
    }
  )

  scenario('creates a qaObjectType', async () => {
    const result = await createQaObjectType({
      input: { name: 'String' },
    })

    expect(result.name).toEqual('String')
  })

  scenario('updates a qaObjectType', async (scenario: StandardScenario) => {
    const original = await qaObjectType({ id: scenario.qaObjectType.one.id })
    const result = await updateQaObjectType({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a qaObjectType', async (scenario: StandardScenario) => {
    const original = await deleteQaObjectType({
      id: scenario.qaObjectType.one.id,
    })
    const result = await qaObjectType({ id: original.id })

    expect(result).toEqual(null)
  })
})
