import QaObjectTypeForm from './QaObjectTypeForm'

export const generated = () => {
  mockGraphQLMutation('CreateQaObjectTypeMutation', (variables, { ctx }) => {
    ctx.delay(2000);

    return {
      createQaObjectType: {
        name: variables.input.name
      }
    };
  });

  return <QaObjectTypeForm />
}

export default { title: 'Components/QaObjectTypeForm' }
