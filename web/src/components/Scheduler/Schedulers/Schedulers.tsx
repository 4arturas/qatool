import {Table} from "antd";
import React from "react";
import SchedulerEditModal from "src/components/SchedulerEditModal/SchedulerEditModal";
import moment from "moment";

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (_, record) =>
      record.name
  },
  {
    title: 'Experiments',
    dataIndex: 'experiments',
    key: 'experiments',
    render: (_, record) =>
      record.experiments.map( e => { return <span key={`experiment${e.id}`}>[{e.name}]</span> } )
  },
  {
    title: 'Execute At',
    dataIndex: 'executeAt',
    key: 'executeAt',
    render: (_, record) =>
      moment(record.executeAt).format('YYYY-MM-DD HH:mm')
  },
  {
    title: 'Times',
    dataIndex: 'times',
    key: 'times',
    render: (_, record) =>
      record.times
  },
  {
    title: 'Executed',
    dataIndex: 'executed',
    key: 'executed',
    render: (_, record) =>
      record.executed && 'executed'
  },
  {
    title: 'Action',
    key: 'action',
    display: true,
    render: (_, record) => !record.executed && <SchedulerEditModal id={record.id}/>
  }
];



const SchedulersList = ({ schedulers }) => {

  return <Table dataSource={schedulers} columns={columns} pagination={{ pageSize: 5 }} rowKey={'id'}/>
}

export default SchedulersList
