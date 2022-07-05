import {
  experimentResults,
  experimentResult,
  createExperimentResult,
  updateExperimentResult,
  deleteExperimentResult,
} from './experimentResults'
import type { StandardScenario } from './experimentResults.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('experimentResults', () => {
  scenario(
    'returns all experimentResults',
    async (scenario: StandardScenario) => {
      const result = await experimentResults()

      expect(result.length).toEqual(
        Object.keys(scenario.experimentResult).length
      )
    }
  )

  scenario(
    'returns a single experimentResult',
    async (scenario: StandardScenario) => {
      const result = await experimentResult({
        id: scenario.experimentResult.one.id,
      })

      expect(result).toEqual(scenario.experimentResult.one)
    }
  )

  scenario('creates a experimentResult', async () => {
    const result = await createExperimentResult({
      input: {
        type: 5144604,
        experimentId: 9882662,
        collectionId: 2441065,
        suiteId: 339031,
        caseId: 3274103,
        thread: 7315836,
        loop: 202071,
      },
    })

    expect(result.type).toEqual(5144604)
    expect(result.experimentId).toEqual(9882662)
    expect(result.collectionId).toEqual(2441065)
    expect(result.suiteId).toEqual(339031)
    expect(result.caseId).toEqual(3274103)
    expect(result.thread).toEqual(7315836)
    expect(result.loop).toEqual(202071)
  })

  scenario('updates a experimentResult', async (scenario: StandardScenario) => {
    const original = await experimentResult({
      id: scenario.experimentResult.one.id,
    })
    const result = await updateExperimentResult({
      id: original.id,
      input: { type: 9602743 },
    })

    expect(result.type).toEqual(9602743)
  })

  scenario('deletes a experimentResult', async (scenario: StandardScenario) => {
    const original = await deleteExperimentResult({
      id: scenario.experimentResult.one.id,
    })
    const result = await experimentResult({ id: original.id })

    expect(result).toEqual(null)
  })
})
