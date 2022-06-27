import {
  messages,
  message,
  createMessage,
  updateMessage,
  deleteMessage,
} from './messages'
import type { StandardScenario } from './messages.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('messages', () => {
  scenario('returns all messages', async (scenario: StandardScenario) => {
    const result = await messages()

    expect(result.length).toEqual(Object.keys(scenario.message).length)
  })

  scenario('returns a single message', async (scenario: StandardScenario) => {
    const result = await message({ id: scenario.message.one.id })

    expect(result).toEqual(scenario.message.one)
  })

  scenario('creates a message', async () => {
    const result = await createMessage({
      input: { type: 7423910 },
    })

    expect(result.type).toEqual(7423910)
  })

  scenario('updates a message', async (scenario: StandardScenario) => {
    const original = await message({ id: scenario.message.one.id })
    const result = await updateMessage({
      id: original.id,
      input: { type: 9370079 },
    })

    expect(result.type).toEqual(9370079)
  })

  scenario('deletes a message', async (scenario: StandardScenario) => {
    const original = await deleteMessage({ id: scenario.message.one.id })
    const result = await message({ id: original.id })

    expect(result).toEqual(null)
  })
})
