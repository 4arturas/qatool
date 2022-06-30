import {Button, Form, Input, Pagination, Select, Table, Tag} from "antd";
import React, {useEffect, useState} from "react";
import {
  COLLECTION,
  getChildrenTypeIdByParentTypeId,
  mySubstr, SERVER,
  typeIdTagMargin,
  typeIdToColor,
  typeIdToName, typeIdToTag,
  TYPES
} from "src/global";
import {useLazyQuery} from "@apollo/client";
import EditObject, {EDIT_OBJECT_CLONE, EDIT_OBJECT_NEW, EDIT_OBJECT_UPDATE} from "src/components/EditObject/EditObject";
import {Link, navigate, routes} from "@redwoodjs/router";
import DeleteObject from "src/components/DeleteObject/DeleteObject";
import QaTrees from "src/layouts/QaTreeLayout/components/Tree/QaTrees/QaTrees";
import {SearchOutlined} from "@ant-design/icons";
const { Option } = Select;

export const QUERY = gql`
  query SearchQaObjectsQuery($searchCriteria: QaObjectSearchCriteria, $page: Int, $pageSize: Int) {
    searchQaObjects(searchCriteria: $searchCriteria, page: $page, pageSize: $pageSize) {
      qaObjects {
        id
        typeId
        name
        description
        batchId
        threads
        loops
        json
        jsonata
        address
        method
        header
        createdAt
        updatedAt
      }
      count
      page
      pageSize
    }
  }
`

const SearchQaObjects = ({page, pageSize}) => {

  const [form] = Form.useForm();
  const columns = [
    {
      title: 'Type',
      dataIndex: 'typeId',
      key: 'typeId',
      width: 100,
      render: (_, record: { key: React.Key }) =>
        typeIdToTag(record.typeId)
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width:300,
      render: (_, record: { key: React.Key }) =>
        <Link to={routes.qaObjectRelationship({id:record.id})}>
          {record.name}
        </Link>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (_, record: { key: React.Key }) =>
        mySubstr(record.description, 9)
    },
    {
      title: 'BatchId',
      dataIndex: 'batchId',
      key: 'batchId',
      width: 50
    },
    {
      title: 'Threads',
      dataIndex: 'threads',
      key: 'threads',
      width: 50
    },
    {
      title: 'Loops',
      dataIndex: 'loops',
      key: 'loops',
      width: 50
    },
    {
      title: 'Json',
      dataIndex: 'json',
      key: 'json',
      width: 200,
      render: (_, record: { key: React.Key }) =>
        mySubstr(record.json, 10)
    },
    {
      title: 'JSONata',
      dataIndex: 'jsonata',
      key: 'jsonata',
      width: 200,
      render: (_, record: { key: React.Key }) =>
        mySubstr(record.jsonata, 10)
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      render: (_, record: { key: React.Key }) =>
        mySubstr(record.address, 10)
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      width: 50
    },
    {
      title: 'Header',
      dataIndex: 'header',
      key: 'header',
      width: 200,
      render: (_, record: { key: React.Key }) =>
        mySubstr(record.header, 10)
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <EditObject key={`update${record.id}`} object={record} type={EDIT_OBJECT_UPDATE}/>&nbsp;&nbsp;&nbsp;
          <EditObject key={`clone${record.id}`} object={record} type={EDIT_OBJECT_CLONE}/>&nbsp;&nbsp;&nbsp;
          <DeleteObject key={`delete${record.id}`} id={record.id} />&nbsp;&nbsp;&nbsp;
          {
            getChildrenTypeIdByParentTypeId(record.typeId).map( (typeId, i) =>
              <span key={`new${i}${record.id}${typeId}`}>
                <EditObject object={{ id:record.id, typeId: typeId }} type={EDIT_OBJECT_NEW}/> {typeIdToTag(typeId)}
              </span>
            )
          }
        </>
      ),
    },
  ];

  const [searchCriteria, setSearchCriteria] = useState({ });
  const [qaObjectPage, setQaObjectPage] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const [searchQaObjects, { called, loading, error, data }] = useLazyQuery(QUERY, {
    // variables: { searchCriteria: searchCriteria, page: page, pageSize: pageSize },
    onCompleted: async () => {
      setLoadingData( false );
      setQaObjectPage( data.searchQaObjects );
    }
  });

  const tagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <Tag
        color={typeIdToColor(value)}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3, color:'black' }}
      >
        {label}
      </Tag>
    );
  };

  useEffect(() => {
    searchQaObjects({variables: { searchCriteria: {}, page: page, pageSize: pageSize }});
  }, [] );

  return <>

    <table style={{width: '100%', marginLeft:'15px', marginBottom: '5px'}} cellPadding={0} cellSpacing={0}>
      <tbody>
      <tr>
        <td>
          <Form
            form={form}
            name="basic"
            layout='inline'
            initialValues={{remember: false}}
            onFinish={ (values: any) => {
              setSearchCriteria( values );
              setLoadingData( true );
              searchQaObjects({variables: { searchCriteria: values, page: page, pageSize: pageSize }});
            }}
            onFinishFailed={(errorInfo: any) => {
              console.log('Failed:', errorInfo);
            }}
            autoComplete="off"
          >
            <Form.Item
              label='Type'
              name='typeId'
            >
              <Select
                mode="multiple"
                showArrow
                tagRender={tagRender}
                style={{minWidth: '200px'}}
                allowClear
                options={ TYPES.map((t,i) => { return { value: t, label: typeIdToName(t) } }) }
              />
            </Form.Item>

            <Form.Item
              label='Name'
              name='name'
            >
              <Input allowClear />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={loading}>
                <SearchOutlined style={{fontSize: '20px'}}/>
              </Button>
            </Form.Item>
          </Form>
        </td>
        <td style={{textAlign: "right", paddingRight: '50px'}}>
          <EditObject object={null} type={EDIT_OBJECT_NEW}/>
        </td>
      </tr>
      </tbody>
    </table>

    { qaObjectPage &&

      <>
        <table style={{width:'100%'}} cellPadding={0} cellSpacing={0}>
          <tbody>
          <tr>
            <td style={{verticalAlign:'top', paddingTop: '20px'}}>
              <div><QaTrees typeId={SERVER}/></div>
              <div><QaTrees typeId={COLLECTION}/></div>
            </td>
            <td style={{verticalAlign:'top'}}>
              <Table
                dataSource={qaObjectPage.qaObjects}
                columns={columns}
                pagination={false}
                loading={loadingData}
                bordered
                expandable={{
                  expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                  rowExpandable: record => (getChildrenTypeIdByParentTypeId(record.typeId).length>0),
                }}
                rowKey={'id'}/>
            </td>
          </tr>
          </tbody>
        </table>

        <table style={{width:'100%', marginTop:'20px'}}>
          <tbody>
            <tr>
              <td style={{textAlign: 'center'}}>
                <div>
                <Pagination
                  defaultPageSize={pageSize}
                  defaultCurrent={page}
                  onChange={ ( p) => {
                    setLoadingData(true);
                    searchQaObjects({variables: { searchCriteria: searchCriteria, page: p, pageSize: pageSize }});
                    navigate(routes.tmpQaObject({page: p, pageSize: pageSize}))
                    setLoadingData(false);
                  }
                  }
                  showSizeChanger
                  onShowSizeChange={ ( current, ps) =>
                    window.location.replace(routes.tmpQaObject({page: 1, pageSize: ps}))
                  }
                  pageSizeOptions={[5, 10, 20, 50, 100]}
                  total={qaObjectPage.count}
                />
                <div style={{margin: '7px 25px'}}><b>Total:</b> <span>{qaObjectPage.count}</span></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </>
    }

  </>
}

export default SearchQaObjects
