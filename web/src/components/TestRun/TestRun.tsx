import React, {useState} from "react";
import {Button, Input, Modal, Select, Spin} from "antd";
import ReactDiffViewer from "react-diff-viewer";
import jsonata from "jsonata";
import {mergeObjectsFromTestObject} from "src/global";
import Title from "antd/lib/typography/Title";
import Search from "antd/lib/input/Search";
const { Option } = Select;

const TestRun = ({body, test, replace, remove, result, servers}) => {
  const [server, setServer] = useState(null);
  const [messageOutgoing, setMessageOutgoing] = useState(null);
  const [messageIncoming, setMessageIncoming] = useState(null);

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    // setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    const tmpServer = server;
    setServer(null);
    // setResponse(null)
    try {
      const res = await fetch(`/.redwood/functions/runTest`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({
            server: server.id,
            body: body.id,
            test: test.id,
            replace: replace.id,
            remove: remove.id
          })
        });
      const response = await res;
      console.log('response', response);
      const data = (await res.json()).data;
      console.log('data',data);
      setMessageOutgoing(data.messageOutgoing);
      setMessageIncoming(data.messageIncoming);
      setServer(tmpServer);
    }
    catch ( error )
    {
      setMessageOutgoing(error);
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Run Test
      </Button>
      <Modal
        title="Run Test"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{ disabled: !server }}
        cancelButtonProps={{ disabled: confirmLoading }}
        width='50%'
      >
        <table style={{width:'100%'}}>
          <tbody>

          <tr>
            <td style={{display:'flex' }}>
              <Select defaultValue="-1"
                      onChange={(e) => setServer( servers.find( (s) => s.id === e ) ) }
                      style={{marginBottom:'10px'}}
                      disabled={confirmLoading}
              >
                <Option key={-1} value="-1">Select server</Option>
                {servers.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
              </Select>
              &nbsp;&nbsp;&nbsp;
              <Search
                addonBefore="Payment ID"
                placeholder="Payment ID"
                allowClear
                enterButton={''}
                style={{ width: 400 }}
                defaultValue={'QA-' + new Date().getTime()}
              />
            </td>
          </tr>

          <tr>
            <td><b>Request:</b></td>
          </tr>
          <tr>
            <td>
              <div style={{maxWidth: '100%', maxHeight: '200px', overflow: "auto"}}>
                <ReactDiffViewer
                  newValue={JSON.stringify(mergeObjectsFromTestObject(JSON.parse(body.json), JSON.parse(replace.json),  JSON.parse(remove.json)), undefined, 2 )}
                  splitView={false}/>
              </div>
            </td>
          </tr>

          <tr><td style={{paddingTop:'10px'}}>{confirmLoading&&<Spin/>}</td></tr>


          {messageIncoming &&
            <>
              <tr>
                <td><b>Incoming Payment:</b></td>
              </tr>
              <tr>
                <td>
                  <div style={{maxWidth: '100%', maxHeight: '200px', overflow: "auto"}}>
                    <ReactDiffViewer newValue={JSON.stringify(JSON.parse(messageIncoming.response), null, 2)}
                                     splitView={false}/>
                  </div>
                </td>
              </tr>
            </>
          }
          {messageOutgoing &&
            <>
              <tr>
                <td>
                  <b>Response:</b>
                  <div>
                    <strong>JSONata:</strong> {messageOutgoing ? <span style={{color:jsonata(result.jsonata).evaluate(JSON.parse(messageOutgoing.response))?'green':'red'}}>{result.jsonata}</span> : <span>{result?.jsonata}</span> }
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{maxWidth: '100%', maxHeight: '200px', overflow: "auto"}}>
                    <ReactDiffViewer newValue={JSON.stringify(JSON.parse(messageOutgoing.response), null, 2)}
                                     splitView={false}/>
                  </div>
                </td>
              </tr>
            </>
          }


          </tbody>
        </table>
      </Modal>
  </>

  )
}

export default TestRun