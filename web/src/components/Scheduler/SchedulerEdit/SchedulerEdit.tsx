import {Button, DatePicker, Form, Input, InputNumber, Select} from "antd";
import React from "react";
import {toast} from "@redwoodjs/web/toast";
import {useApolloClient} from "@apollo/client";
import moment from "moment";

const SchedulerEdit = ( {scheduler, onSave, error, loading } ) => {
  const client = useApolloClient();

  const onFinish = async (values: any) => {
    // const qaObjectsExperiments = values.experiments.map( e => e.value );
    // const qaObjectsExperiments = values.experiments.map( e => { return { id: e.value } } );

    console.log( values.experiments );
    // return;
    values.experiments.map( e => console.log( e.value, e.name ))
    // console.log( values.experiments );
    // return;
    console.log( values.experiments.map( e => e.value ) );
    // return;
    // console.log( qaObjectsExperiments );

    const s = values;
    s.id = scheduler.id;
    // s.experiments = values.experiments.map( e => e.value );
    // delete s['experiments'];
    onSave(s.id, s );
  };

  const onFinishFailed = (errorInfo: any) => {
    // OnSubmitFormFunction(null);
    console.log('Failed:', errorInfo);
  };

  return (
    // <div>ba{JSON.stringify(scheduler)}</div>
    <>
      {error}
    <Form
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      // initialValues={{...scheduler, executeAt: moment(scheduler.executeAt), experiments: scheduler.experiments.map( e => { return {value:e.id, name:e.name} } ) } }
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
            console.log( v );
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
