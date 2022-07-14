import React from "react";
import {Button, Form, Input, Select} from "antd";
import {useApolloClient} from "@apollo/client";

const UserEdit = ( { user, OnSubmitFormFunction }) => {

  const [form] = Form.useForm();
  const client = useApolloClient();

  const onFinish = async (values: any) => {

    const variables = {
      id: user.id,
      input: { email: values.email, userRoles: values.userRoles }
    };
    const UPDATE_USER = gql`
                  mutation UpdateUser($id: Int!, $input: UpdateUserInput!) {
                    updateUser (id: $id, input: $input) {
                      id
                      email
                      userRoles
                    }
                  }`;

    const ret = await client.mutate({
      mutation: UPDATE_USER,
      variables: variables
    });

    console.log ( ret.data.updateUser );


    OnSubmitFormFunction(values)


    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    OnSubmitFormFunction(null);
    console.log('Failed:', errorInfo);
  };

  return <Form
    form={form}
    name="basic"
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
    initialValues={user}
  >

    <Form.Item
      label="Id"
      name="id"
      style={{display:'none'}}
    >
      <Input/>
    </Form.Item>

    <Form.Item
      label="Email"
      name="email"
      rules={[{ required: true, message: 'Please input email!' }]}
    >
      <Input/>
    </Form.Item>

    <Form.Item
      label="Roles"
      name="userRoles"
      rules={[{ required: true, message: 'Please select role!' }]}
    >

      <Select
        placeholder="Select role"
        mode='multiple'
        options={[
          {value:'admin'},
          {value:'customer'},
        ]
      }/>
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Update
      </Button>
    </Form.Item>
  </Form>
}

export default UserEdit
