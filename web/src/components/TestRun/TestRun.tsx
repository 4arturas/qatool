import React, {useState} from "react";
import {Button, Modal, Select, Spin} from "antd";
import Search from "antd/lib/input/Search";
import Timeline from "src/components/Timeline/Timeline";
import {generatePaymentId} from "src/global";
const { Option } = Select;

const TestRun = ({body, test, replace, remove, result, servers}) => {
  const [server, setServer] = useState(null);
  const [paymentId, setPaymentId] = useState(generatePaymentId('QA-OUT'));
  const [messageOutgoing, setMessageOutgoing] = useState(null);
  const [messageIncoming, setMessageIncoming] = useState(null);

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    setMessageOutgoing(null);
    setMessageIncoming(null);

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
            remove: remove.id,
            result: result.id
          })
        });

      const data = (await res.json()).data;
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
        okButtonProps={{ disabled: (!server || paymentId.length===0) }}
        cancelButtonProps={{ disabled: confirmLoading }}
        width='50%'
        closable={!confirmLoading}
        style={{ top: 5 }}
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
                defaultValue={paymentId}
                disabled={confirmLoading}
                onChange={(e)=>setPaymentId(e.target.value)}
              />
            </td>
          </tr>

          <tr><td style={{paddingTop:'10px'}}>{confirmLoading&&<Spin/>}</td></tr>

          {(messageOutgoing) && <Timeline outgoing={messageOutgoing} incoming={messageIncoming} JSONata={result.jsonata}/> }

          </tbody>
        </table>
      </Modal>
  </>

  )
}

export default TestRun
