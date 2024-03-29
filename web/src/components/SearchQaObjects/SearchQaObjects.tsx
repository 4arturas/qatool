import {Badge, Button, Form, Input, Pagination, Select, Table, Tag, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {
  CASE,
  COLLECTION, DEFAULT_TABLE_PAGE_SIZE, EXPERIMENT,
  getChildrenTypeIdByParentTypeId,
  mySubstr, ROLE_ADMIN, SUITE, TEST,
  typeIdToColor,
  typeIdToName, typeIdToTag,
  TYPES, validateJSONata
} from "src/global";
import {useApolloClient, useLazyQuery} from "@apollo/client";
import {Link, navigate, routes, useParams} from "@redwoodjs/router";
import {BarChartOutlined, ExperimentOutlined, SearchOutlined} from "@ant-design/icons";
const { Option } = Select;
import BelongingsCell from 'src/components/BelongingsCell'
import ObjectDelete from "src/components/ObjectDelete/ObjectDelete";
import Merge from "src/components/Merge/Merge";
import JSONModal from "src/components/JSONModal/JSONModal";
import ObjectNewTest from "src/components/ObjectNewTest/ObjectNewTest";
import {useAuth} from "@redwoodjs/auth";
import ObjectDeepClone from "src/components/ObjectDeepClone/ObjectDeepClone";
import {faCubesStacked, faPen} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ObjectView from "src/components/ObjectView/ObjectView";
import MergeModal from "src/components/MergeModal/MergeModal";

export const QUERY = gql`
  query SearchQaObjectsQuery($searchCriteria: QaObjectSearchCriteria, $page: Int, $pageSize: Int, $count: Int) {
    searchQaObjects(searchCriteria: $searchCriteria, page: $page, pageSize: $pageSize, count: $count) {
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
        orgId
        organization {
          id name
        }
        parent {
          id parentId childrenId childrenObjectTypeId
        }
      }
      count
      page
      pageSize
    }
  }
`



const SearchQaObjects = ({currentPage, pageSize, count}) => {
  const client = useApolloClient();
  const { hasRole } = useAuth();
  const [page, setPage] = useState(currentPage);
  const [form] = Form.useForm();
  const columns = [
    {
      title: 'Type',
      dataIndex: 'typeId',
      key: 'typeId',
      width: 100,
      display: true,
      render: (_, record) =>
        typeIdToTag(record.typeId)
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width:300,
      display: true,
      render: (_, record) =>
        <div>
          <Link to={routes.tree({id:record.id})}>
            {record.name}
          </Link>
          <>
            { hasRole(ROLE_ADMIN) && <FontAwesomeIcon icon={faCubesStacked} onClick={()=> navigate(routes.blocklyTree({id:record.id}))} style={{cursor:'pointer', float:'right', marginLeft: '10px'}}/>}

            {record.typeId === EXPERIMENT && record.executed &&
            <Tooltip placement="topLeft" title="Show Experiment Results">
              <Link to={routes.experiment( {id: record.id})} style={{float:'right', color: 'black'}}>
                <BarChartOutlined  style={{fontSize:'20px'}}/>
              </Link>
            </Tooltip>
            }

            {record.typeId === TEST && record.executed &&
            <Tooltip placement="topLeft" title="Show Test Experiment Results">
              <Link to={routes.experimentTest( {testId: record.id})} style={{float:'right', color: 'black'}}>
                <BarChartOutlined  style={{fontSize:'20px'}}/>
              </Link>
            </Tooltip>
            }

            <span style={{float:'right', color: 'black', marginRight:'10px'}}><MergeModal qaObject={record} /></span>

          </>
        </div>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      display: true,
      render: (_, record) =>
        mySubstr(record.description, 9)
    },
    {
      title: 'BatchId',
      dataIndex: 'batchId',
      key: 'batchId',
      width: 50,
      display: hasRole([ROLE_ADMIN]),
    },
    {
      title: 'Threads',
      dataIndex: 'threads',
      key: 'threads',
      width: 50,
      display: hasRole([ROLE_ADMIN]),
    },
    {
      title: 'Loops',
      dataIndex: 'loops',
      key: 'loops',
      width: 50,
      display: hasRole([ROLE_ADMIN]),
    },
    {
      title: 'Json',
      dataIndex: 'json',
      key: 'json',
      width: 200,
      display: hasRole([ROLE_ADMIN]),
      render: (_, record) =>
        <>{ record.json && <span style={{whiteSpace:'nowrap'}}>{mySubstr(record.json, 5)}&nbsp;<span style={{float:'right'}}><JSONModal title='JSON' json={record.json} /></span></span> }</>
    },
    {
      title: 'JSONata',
      dataIndex: 'jsonata',
      key: 'jsonata',
      width: 100,
      display: hasRole([ROLE_ADMIN]),
      render: (_, record) =>
        <>{(record.json && record.jsonata) && (validateJSONata(record.jsonata, record.json) ? <Badge status="success" />:<Badge status="error" />)}{mySubstr(record.jsonata, 5)}</>
    },
    {
      title: 'Owner',
      dataIndex: 'orgId',
      key: 'orgId',
      width: 100,
      display: hasRole([ROLE_ADMIN]),
      render: (_, record) => record.organization.name
    },
    {
      title: 'Action',
      key: 'action',
      display: true,
      render: (_, record) =>
        <span id={`edibBlock${record.id}${record.typeId}`} style={{whiteSpace:'nowrap'}}>
          <ObjectView qaObject={record} />&nbsp;&nbsp;&nbsp;
          { hasRole([ROLE_ADMIN] ) && <>
          { !record.executed &&
            <ObjectNewTest
              typeId={record.typeId}
              qaObject={record}
              children={record.parent.map(p => {
                return {id: p.childrenId, typeId: p.childrenObjectTypeId}
              })}
              cloneObject={false}
              parentId={null}
              beforeSave={() => {
              }}
              afterSave={(editQaObject) => {
                const newPage = {...qaObjectPage};
                newPage.qaObjects = qaObjectPage.qaObjects.map(q => {
                  return q.id === editQaObject.id ? editQaObject : q
                });
                setQaObjectPage(newPage);
              }}/>
          }
          &nbsp;&nbsp;&nbsp;
          { !record.executed &&
            <ObjectNewTest
              typeId={record.typeId}
              qaObject={record}
              children={[]}
              cloneObject={true}
              parentId={null}
              beforeSave={() => {
              }}
              afterSave={(cloneQaObject) => {
                const newPage = {...qaObjectPage};
                newPage.qaObjects = [];
                newPage.qaObjects.push(cloneQaObject);
                qaObjectPage.qaObjects.map(q => newPage.qaObjects.push(q));
                setQaObjectPage(newPage);
              }}/>
          }
          &nbsp;&nbsp;&nbsp;
          <ObjectDeepClone
            qaObject={record}
            beforeSave={()=>{}}
            afterSave={ ( cloneQaObject ) => {
              const newPage = { ...qaObjectPage };
              newPage.qaObjects = [];
              newPage.qaObjects.push( cloneQaObject );
              qaObjectPage.qaObjects.map( q => newPage.qaObjects.push( q ) );
              setQaObjectPage( newPage );
            }}/>
          &nbsp;&nbsp;&nbsp;
          {!record.executed &&
            <ObjectDelete key={`delete${record.id}`}
                          id={record.id}
                          typeId={record.typeId}
                          beforeSave={() => {
                          }}
                          afterSave={(id) => {
                            const newPage = {...qaObjectPage};
                            newPage.qaObjects = qaObjectPage.qaObjects.filter(q => q.id !== id);
                            newPage.count = qaObjectPage.count - 1;
                            setQaObjectPage(newPage);
                            // document.getElementById(`edibBlock${record.id}${record.typeId}`).style.display = 'none';
                          }
                          }/>
          }
          &nbsp;&nbsp;&nbsp;
          { !record.executed &&
            getChildrenTypeIdByParentTypeId(record.typeId).map( (typeId, i) =>
            {
              {
                return (
                  ( record.typeId === COLLECTION || record.typeId === SUITE ) ||
                    ( ( record.typeId === EXPERIMENT || record.typeId === TEST || record.typeId === CASE) && !record.parent.find(p => typeId === p.childrenObjectTypeId ) ) ) &&

                  <span key={`new${i}${record.id}${typeId}`}>
                    <ObjectNewTest
                      typeId={typeId}
                      qaObject={null}
                      children={ [] }
                      cloneObject={false}
                      parentId={record.id}
                      beforeSave={()=>{}}
                      afterSave={ ( id ) => {
                        client.query({
                          query: gql`
                              query FindQaObjectByIdQueryForSearch($id: Int!) {
                                qaObject: qaObject(id: $id) {
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
                                  organization {
                                    name
                                  }
                                  parent {
                                    id parentId childrenId childrenObjectTypeId
                                  }
                                }
                              }`,
                          variables: { id: record.id }
                        }).then( ret => {
                          const refreshedQaObject = ret.data.qaObject;
                          const newPage = { ...qaObjectPage };
                          newPage.qaObjects = qaObjectPage.qaObjects.map( q => {
                            return q.id === refreshedQaObject.id ? refreshedQaObject : q;
                          });
                          setQaObjectPage( newPage );
                        } );
                        // window.location.reload();
                      }}/>
                  </span>
              }
            })
          }
          </> }
        </span>

    },
  ];

  const [qaObjectPage, setQaObjectPage] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const [searchQaObjects, { called, loading, error, data }] = useLazyQuery(QUERY, {
    // variables: { searchCriteria: searchCriteria, page: page, pageSize: pageSize },
    onCompleted: async () => {
      setLoadingData( false );
      setQaObjectPage( data.searchQaObjects );
    }
  });

  const QaTrees = ({typeId}) => {
    const childTypeId: Array<number> = getChildrenTypeIdByParentTypeId(typeId);
    return (
      <>
        <ObjectNewTest
          typeId={typeId}
          qaObject={null}
          children={null}
          cloneObject={false}
          parentId={null}
          beforeSave={()=>{}}
          afterSave={( newQaObject )=>{
            const newPage = { ...qaObjectPage };
            newPage.qaObjects = [];
            newPage.qaObjects.push( newQaObject );
            qaObjectPage.qaObjects.map( q => newPage.qaObjects.push( q ) );
            setQaObjectPage( newPage );
          }}/>
        <span
          style={{marginLeft:'3px', cursor:'pointer'}}
          onClick={ () => {
            searchQaObjects({variables: { searchCriteria: {typeId: typeId}, page: 1, pageSize: DEFAULT_TABLE_PAGE_SIZE, count: 0 }});
          }}
        >
          {typeIdToTag(typeId)}
      </span>
        {
          childTypeId.map( (childTypeId) =>
            <div key={`${childTypeId}div`} style={{marginLeft:'10px', marginBottom: '10px', marginTop: '10px', whiteSpace:'nowrap'}}>
              <QaTrees typeId={childTypeId}/>
            </div>
          )
        }
      </>
    )
  }

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

  const { name, typeId } = useParams();

  let tmpSearchCriteria = {};
  if ( typeId ) tmpSearchCriteria['typeId'] = typeId.split(',').map( t => parseInt(t) );
  if ( name ) tmpSearchCriteria['name'] = name;

  useEffect(() => {
    searchQaObjects({variables: { searchCriteria: tmpSearchCriteria, page: page, pageSize: pageSize, count: count }});
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
            initialValues={tmpSearchCriteria}
            onFinish={ (values: any) => {
              Object.keys( values ).map( m => { if ( !values[m] ) delete values[m]; } );
              tmpSearchCriteria = values;
              setLoadingData( true );
              navigate(routes.qaObjects({page:1, pageSize:pageSize, count: 0, ...tmpSearchCriteria}));
              setPage(1);
              searchQaObjects({variables: { searchCriteria: tmpSearchCriteria, page: 1, pageSize: pageSize, count: 0 }});
            }}
            onFinishFailed={(errorInfo: any) => {
              console.log('Failed:', errorInfo);
            }}
            autoComplete="off"
          >
            { hasRole([ROLE_ADMIN]) &&
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
                  options={TYPES.map((t, i) => {
                    return {value: t, label: typeIdToName(t)}
                  })}
                />
              </Form.Item>
            }
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
            { hasRole([ROLE_ADMIN]) &&
              <td style={{verticalAlign: 'top', paddingTop: '20px', paddingLeft: '5px', width: '10px'}}>
                <div><QaTrees typeId={EXPERIMENT}/></div>
              </td>
            }
            <td style={{verticalAlign:'top'}}>
              <Table
                dataSource={qaObjectPage.qaObjects}
                columns={columns.filter( c => c.display )}
                pagination={false}
                loading={loadingData}
                bordered
                expandable={!hasRole([ROLE_ADMIN]) ? null :
                  {
                  expandedRowRender: record => <BelongingsCell parentId={record.id} />,
                  rowExpandable: record => (getChildrenTypeIdByParentTypeId(record.typeId).length>0),
                  }
                }
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
                    searchQaObjects({variables: { searchCriteria: tmpSearchCriteria, page: p, pageSize: pageSize, count: qaObjectPage.count }});
                    navigate(routes.qaObjects({ page: p, pageSize: pageSize, count: qaObjectPage.count } ) )
                    setLoadingData(false);
                  }
                  }
                  showSizeChanger
                  onShowSizeChange={ ( current, ps) =>
                    window.location.replace(routes.qaObjects({page: 1, pageSize: ps, count: qaObjectPage.count}))
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
