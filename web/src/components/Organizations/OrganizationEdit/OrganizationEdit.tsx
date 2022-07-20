import {Button, Form, Input} from "antd";
import {useApolloClient} from "@apollo/client";
import React from "react";
import {toast} from "@redwoodjs/web/toast";


const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
    }
  }`;

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

  const onFinish = (values: any) => {
    if ( organization )
    {
      client.mutate({
        mutation: UPDATE_ORGANIZATION,
        variables: { id: values.id, input: values }
      })
      .then( ret => {
        OnSubmitFormFunction( ret.data.updateOrganization );
        toast.success('Organization was updated');
      } );

    }
    else
    {
      client.mutate({
        mutation: CREATE_ORGANIZATION,
        variables: { input: values }
      })
      .then( ret => {
        OnSubmitFormFunction( ret.data.createOrganization );
        toast.success('Organization was created')
      } );

    }
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
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
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
