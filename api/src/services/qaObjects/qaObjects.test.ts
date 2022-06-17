import {
  qaObjects,
  qaObject,
  createQaObject,
  updateQaObject,
  deleteQaObject,
} from './qaObjects'
import type { StandardScenario } from './qaObjects.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('qaObjects', () => {
  scenario('returns all qaObjects', async (scenario: StandardScenario) => {
    const result = await qaObjects()

    expect(result.length).toEqual(Object.keys(scenario.qaObject).length)
  })

  scenario('returns a single qaObject', async (scenario: StandardScenario) => {
    const result = await qaObject({ id: scenario.qaObject.one.id })

    expect(result).toEqual(scenario.qaObject.one)
  })

  scenario('creates a qaObject', async (scenario: StandardScenario) => {
    const result = await createQaObject({
      input: {
        typeId: scenario.qaObject.two.typeId,
        name: 'String',
        updatedAt: '2022-06-17T05:52:46Z',
      },
    })

    expect(result.typeId).toEqual(scenario.qaObject.two.typeId)
    expect(result.name).toEqual('String')
    expect(result.updatedAt).toEqual('2022-06-17T05:52:46Z')
  })

  scenario('updates a qaObject', async (scenario: StandardScenario) => {
    const original = await qaObject({ id: scenario.qaObject.one.id })
    const result = await updateQaObject({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a qaObject', async (scenario: StandardScenario) => {
    const original = await deleteQaObject({ id: scenario.qaObject.one.id })
    const result = await qaObject({ id: original.id })

    expect(result).toEqual(null)
  })
})
