import {Badge, Button, Form, Input, Pagination, Select, Table, Tag, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {
  COLLECTION, EXPERIMENT,
  getChildrenTypeIdByParentTypeId,
  mySubstr, SERVER,
  typeIdToColor,
  typeIdToName, typeIdToTag,
  TYPES, validateJSONata
} from "src/global";
import {useLazyQuery} from "@apollo/client";
import {Link, navigate, routes} from "@redwoodjs/router";
import QaTrees from "src/layouts/QaTreeLayout/components/Tree/QaTrees/QaTrees";
import {BarChartOutlined, ExperimentOutlined, SearchOutlined} from "@ant-design/icons";
const { Option } = Select;
import BelongingsCell from 'src/components/BelongingsCell'
import ObjectClone from "src/components/ObjectClone/ObjectClone";
import ObjectDelete from "src/components/ObjectDelete/ObjectDelete";
import ObjectNew from "src/components/ObjectNew/ObjectNew";
import ObjectEdit from "src/components/ObjectEdit/ObjectEdit";
import Merge from "src/components/Merge/Merge";

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
        executed
      }
      count
      page
      pageSize
    }
  }
`

const SearchQaObjects = ({currentPage, pageSize}) => {

  const [page, setPage] = useState(currentPage);
  const [form] = Form.useForm();
  const columns = [
    {
      title: 'Type',
      dataIndex: 'typeId',
      key: 'typeId',
      width: 100,
      render: (_, record) =>
        typeIdToTag(record.typeId)
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width:300,
      render: (_, record) =>
        <div>
          <Link to={routes.qaObjectRelationship({id:record.id})}>
            {record.name}
          </Link>
          <>
            <span style={{float:'right', color: 'black'}}><Merge qaObjectParent={record} /></span>

            {record.typeId === EXPERIMENT &&
            <Tooltip placement="topLeft" title="Run Experiment" color={typeIdToColor(record.typeId)}>
              <Link to={routes.experiment( {id: record.id})} style={{float:'right', color: 'black'}}>
                { record.executed ? <BarChartOutlined  style={{fontSize:'20px'}}/> : <ExperimentOutlined style={{fontSize:'20px'}}/> }
              </Link>
            </Tooltip>
            }
          </>
        </div>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (_, record) =>
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
      render: (_, record) =>
        mySubstr(record.json, 10)
    },
    {
      title: 'JSONata',
      dataIndex: 'jsonata',
      key: 'jsonata',
      width: 200,
      render: (_, record) =>
        <>{(record.json && record.jsonata) && (validateJSONata(record.jsonata, record.json) ? <Badge status="success" />:<Badge status="error" />)}{mySubstr(record.jsonata, 10)}</>
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      render: (_, record) =>
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
      render: (_, record) =>
        mySubstr(record.header, 10)
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span id={`edibBlock${record.id}${record.typeId}`}>
          <ObjectEdit qaObject={record} beforeSave={()=>{}} afterSave={()=>{}}/>&nbsp;&nbsp;&nbsp;
          <ObjectClone parentId={(record.typeId===COLLECTION || record.typeId===SERVER) ? null : record.id} qaObject={record} beforeSave={()=>{}} afterSave={(newObject)=>{} }/>&nbsp;&nbsp;&nbsp;
          <ObjectDelete key={`delete${record.id}`}
                        id={record.id}
                        beforeSave={()=>{}}
                        afterSave={(id)=> {
                          document.getElementById(`edibBlock${record.id}${record.typeId}`).style.display = 'none';
                        }
                      }/>&nbsp;&nbsp;&nbsp;
          {
            getChildrenTypeIdByParentTypeId(record.typeId).map( (typeId, i) =>
              <span key={`new${i}${record.id}${typeId}`}>
                <ObjectNew typeId={typeId} parentId={record.id} beforeSave={()=>{}} afterSave={(newObject)=>{ console.log(newObject); } }/>
              </span>
            )
          }
        </span>
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

  const tagRender = (props) => {
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
              navigate(routes.qaObjects({page:1, pageSize:pageSize}));
              setPage(1);
              searchQaObjects({variables: { searchCriteria: values, page: 1, pageSize: pageSize }});
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
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
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
      </tr>
      </tbody>
    </table>
    { qaObjectPage &&

      <>
        <table style={{width:'100%'}} cellPadding={0} cellSpacing={0}>
          <tbody>
          <tr>
            <td style={{verticalAlign:'top', paddingTop: '20px', paddingLeft: '5px'}}>
              <div><QaTrees typeId={EXPERIMENT}/></div>
            </td>
            <td style={{verticalAlign:'top'}}>
              <Table
                dataSource={qaObjectPage.qaObjects}
                columns={columns}
                pagination={false}
                loading={loadingData}
                bordered
                expandable={{
                  expandedRowRender: record => <BelongingsCell parentId={record.id} />,
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
                  // defaultCurrent={page}
                  current={page}
                  onChange={ ( p) => {
                    setPage(p);
                    setLoadingData(true);
                    searchQaObjects({variables: { searchCriteria: searchCriteria, page: p, pageSize: pageSize }});
                    navigate(routes.qaObjects({page: p, pageSize: pageSize}))
                    setLoadingData(false);
                  }
                  }
                  showSizeChanger
                  onShowSizeChange={ ( current, ps) =>
                    window.location.replace(routes.qaObjects({page: 1, pageSize: ps}))
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
