import {
  schedulers,
  scheduler,
  createScheduler,
  updateScheduler,
  deleteScheduler,
} from './schedulers'
import type { StandardScenario } from './schedulers.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('schedulers', () => {
  scenario('returns all schedulers', async (scenario: StandardScenario) => {
    const result = await schedulers()

    expect(result.length).toEqual(Object.keys(scenario.scheduler).length)
  })

  scenario('returns a single scheduler', async (scenario: StandardScenario) => {
    const result = await scheduler({ id: scenario.scheduler.one.id })

    expect(result).toEqual(scenario.scheduler.one)
  })

  scenario('creates a scheduler', async () => {
    const result = await createScheduler({
      input: { name: 'String' },
    })

    expect(result.name).toEqual('String')
  })

  scenario('updates a scheduler', async (scenario: StandardScenario) => {
    const original = await scheduler({ id: scenario.scheduler.one.id })
    const result = await updateScheduler({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a scheduler', async (scenario: StandardScenario) => {
    const original = await deleteScheduler({ id: scenario.scheduler.one.id })
    const result = await scheduler({ id: original.id })

    expect(result).toEqual(null)
  })
})
