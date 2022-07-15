import React from "react";
import {Button, Form, Input, Select} from "antd";
import {useApolloClient} from "@apollo/client";
import {toast} from "@redwoodjs/web/toast";
import {useAuth} from "@redwoodjs/auth";

const UserEdit = ( { user, OnSubmitFormFunction }) => {

  const [form] = Form.useForm();
  const client = useApolloClient();
  const { signUp } = useAuth()

  const onFinish = async (values: any) => {
    if ( user )
    {
      const UPDATE_USER = gql`
                  mutation UpdateUser($id: Int!, $input: UpdateUserInput!) {
                    updateUser(id: $id, input: $input) {
                      id
                      email
                      userRoles {
                        name
                      }
                    }
                  }`;

      const userRoles = values.userRoles.map( roleName => roleName );

      const ret = await client.mutate({
        mutation: UPDATE_USER,
        variables: { id: user.id, input: {email: values.email, userRoles: userRoles } }
      });

      OnSubmitFormFunction(values)
    }
    else
    {
      const response = await signUp({ username: values.email, password: values.password, userRoles: values.userRoles } );

      if (response.message)
      {
        // toast('New user was added' );
        toast.success('New user was added' );
        const userId = parseInt( response.message );

        OnSubmitFormFunction({ id: userId, ...values })
        // toast(response.message)
      }
      else if (response.error)
      {
        toast.error(response.error)
      }
      else {
        // user is signed in automatically
        toast.success('Welcome!')
      }

    }
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
    initialValues={user && {...user, userRoles: user.userRoles.map(ur=>ur.name)}}
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

    { !user &&
      <Form.Item
        label="Password"
        name="password"
        rules={[{required: true, message: 'Please input password!'}]}
      >
        <Input.Password/>
      </Form.Item>
    }

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
        { user ? 'Update User' : 'Create New User' }
      </Button>
    </Form.Item>
  </Form>
}

export default UserEdit
