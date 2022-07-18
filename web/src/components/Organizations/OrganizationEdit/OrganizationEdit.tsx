import {Button, Form, Input} from "antd";
import {useApolloClient} from "@apollo/client";
import React from "react";


const UPDATE_ORGANIZATION = gql`
                  mutation UpdateOrganization($id: Int!, $input: UpdateOrganizationInput!) {
                    updateOrganization(id: $id, input: $input) {
                      id
                      name
                    }
                  }`;



const OrganizationEdit = ( { organization, OnSubmitFormFunction } ) => {
  const [form] = Form.useForm();
  const client = useApolloClient();

  const onFinish = async (values: any) => {
    const ret = await client.mutate({
      mutation: UPDATE_ORGANIZATION,
      variables: { id: values.id, input: values }
    });
    console.log( 'ret', ret );
    console.log( 'onFinish', values );
  };

  const onFinishFailed = (errorInfo: any) => {
    OnSubmitFormFunction(null);
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      form={form}
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      initialValues={organization}
    >
      <Form.Item
        label="Id"
        name="id"
        style={{display:'none'}}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input name!' }]}
      >
        <Input/>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          { organization ? 'Update Organization' : 'Create New Organization' }
        </Button>
      </Form.Item>

    </Form>
  )
}

export default OrganizationEdit
