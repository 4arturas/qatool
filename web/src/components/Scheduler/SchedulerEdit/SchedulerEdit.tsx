import {Button, DatePicker, Form, Input, InputNumber, Select} from "antd";
import React from "react";
import {toast} from "@redwoodjs/web/toast";
import {useApolloClient} from "@apollo/client";
import moment from "moment";

const SchedulerEdit = ( {scheduler, onSave, error, loading } ) => {

  const onFinish = async (values: any) => {
    const s = values;
    s.id = scheduler.id;
    onSave(s.id, s );
  };

  const onFinishFailed = (errorInfo: any) => {
    // OnSubmitFormFunction(null);
    console.log('Failed:', errorInfo);
  };

  return (
    <>
    <Form
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{...scheduler, executeAt: moment(scheduler.executeAt)} }
      disabled={loading}
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

      <Form.Item
        label="Execute At"
        name="executeAt"
        rules={[{ required: true, message: 'Please input Execute At time!' }]}
      >
        <DatePicker showTime format={'YYYY-MM-DD hh:mm'} />
      </Form.Item>

      <Form.Item
        label="Times"
        name="times"
        rules={[{ required: true, message: 'Please input Times!' }]}
      >
        <InputNumber/>
      </Form.Item>


      <Form.Item
        label="Experiment"
        name="experiments"
        rules={[{ required: true, message: 'Please select Experiment!' }]}
      >
        <Select
          mode={'multiple'}
          placeholder="Select Experiment"
          onChange={ ( v, c ) => {
            // scheduler.experiments.push( { value: v, label: c })
            // form.setFieldsValue({organizationName: c.label });
          } }
          options={ scheduler.experimentsAll.map( o => { return { value: o.id, label: o.name } } ) }
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </>
  )
}

export default SchedulerEdit
