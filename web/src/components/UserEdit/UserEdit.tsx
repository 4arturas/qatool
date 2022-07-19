import React, {useEffect, useState} from "react";
import {Button, Form, Input, Select} from "antd";
import {useApolloClient} from "@apollo/client";
import {toast} from "@redwoodjs/web/toast";
import {useAuth} from "@redwoodjs/auth";
import {updateUser} from "src/services/user/user";

export const QUERY = gql`
  query OrganizationsQueryForTheUser {
    organizations: getOrganizations {
      id
      name
    }
  }
`

const UserEdit = ( { user, OnSubmitFormFunction }) => {

  const [form] = Form.useForm();
  const client = useApolloClient();
  const { signUp } = useAuth();
  const [organizations, setOrganizations] = useState([]);

  useEffect( () => {
    client.query( { query: QUERY }  )
    .then( res => {
      setOrganizations( res.data.organizations );
    } )
      .catch( error => toast( error.message ) );
  }, [] );

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
                      orgId
                      organization {
                        id
                        name
                      }
                    }
                  }`;

      const userRoles = values.userRoles.map( roleName => roleName );

      client.mutate({
        mutation: UPDATE_USER,
        variables: { id: user.id, input: {email: values.email, userRoles: userRoles, orgId: values.orgId } }
      })
      .then( res => {
        const updatedUser = res.data.updateUser;
        console.log( updatedUser );
        OnSubmitFormFunction( updatedUser );
      });


    }
    else
    {
      const response = await signUp({ username: values.email, password: values.password, userRoles: values.userRoles, orgId: values.orgId } );

      if (response.message)
      {
        // toast('New user was added' );
        const newValues = { id: null, ...values };
        newValues.id = parseInt( response.message );
        OnSubmitFormFunction( newValues );
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
          {value:'admin', label: 'admin' },
          {value:'customer', label: 'customer' },
        ]
      }/>
    </Form.Item>

    <Form.Item
      label="OrganizationName"
      name="organizationName"
      rules={[{ required: false }]}
      style={{display:'none'}}
    >

      <Input />
    </Form.Item>

    <Form.Item
      label="Organization"
      name="orgId"
      rules={[{ required: true, message: 'Please select organization!' }]}
    >

      <Select
        placeholder="Select Organization"
        onChange={ ( v, c ) => {
          form.setFieldsValue({organizationName: c.label });
        } }
        options={ organizations.map( o => { return { value: o.id, label: o.name } } ) }
      />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        { user ? 'Update User' : 'Create New User' }
      </Button>
    </Form.Item>
  </Form>
}

export default UserEdit
