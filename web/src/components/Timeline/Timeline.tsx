import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import React, {useState} from "react";
import {LoginOutlined, LogoutOutlined} from "@ant-design/icons";
import jsonata from "jsonata";
import {Chart} from "react-google-charts";
import {colorIncoming, colorOutgoing, dateFormatYYYYMMDDHHmmss} from "src/global";
import ReactJson from "react-json-view";
import {Alert} from "antd";

const VTE = ( {title, color, date, json, position, JSONata, icon} ) =>
{
  const [valid] = useState(!JSONata?false:jsonata(JSONata).evaluate(JSON.parse(json)));

  const textAreaBackground = !JSONata ? 'white' : ( valid ? 'lightgreen':'#FFCCCB' );

  return <VerticalTimelineElement
    className="vertical-timeline-element--work"
    contentStyle={{ background: `${color}`}}
    contentArrowStyle={{ borderRight: `7px solid  ${color}` }}
    date={dateFormatYYYYMMDDHHmmss(date)}
    iconStyle={{ background: `${color}`, color: '#000' }}
    icon={icon}
    position={position}
  >
    <h3 className="vertical-timeline-element-title"><u>{title}</u></h3>

    { JSONata && <Alert style={{marginBottom:'5px'}} type={valid?'success':'error'} showIcon message={'JSONata'} description={JSONata}/> }

    <ReactJson src={JSON.parse(json)} style={{maxHeight:'180px', overflow: 'auto', backgroundColor: `${textAreaBackground}`}}/>

  </VerticalTimelineElement>
}

const Timeline = ( {incoming, outgoing, JSONata} ) => {

  const columns = [
    { type: "string", id: "RequestResponse" },
    { type: "date", id: "Start" },
    { type: "date", id: "End" },
  ];

  const rows =
    (outgoing&&incoming) ?
      [
        ["Outgoing", new Date(outgoing.requestDate), new Date(outgoing.responseDate)],
        ["Incoming", new Date(outgoing.requestDate), new Date(incoming.responseDate)]
      ] :
      [
        ["Outgoing", new Date(outgoing.requestDate), new Date(outgoing.responseDate)]
      ];

  const data = [columns, ...rows];

  return (
    <div style={{backgroundColor: 'whitesmoke'}}>

      <Chart chartType="Timeline"
             data={data}
             width="100%" height="135px"
             options={{
               colors: [ outgoing && `${colorOutgoing}`, incoming && `${colorIncoming}`],
             }}/>

      <VerticalTimeline>

        { outgoing && <VTE title={'Outgoing request'} color={colorOutgoing} date={outgoing.requestDate} json={outgoing.request} position={'left'} JSONata={null}
              icon={<LoginOutlined style={{marginLeft:'23px', marginTop: '30px'}}/>}/> }

        { incoming &&
          <VTE title={'Incoming response'} color={colorIncoming} date={incoming.responseDate} json={incoming.response} position={'right'} JSONata={null}
              icon={<LogoutOutlined style={{marginLeft:'23px', marginTop: '30px'}}/>}/> }

        { outgoing && <VTE title={'Outgoing response'} color={colorOutgoing} date={outgoing.responseDate} json={outgoing.response} position={'right'} JSONata={JSONata}
              icon={<LogoutOutlined style={{marginLeft:'23px', marginTop: '30px'}}/>}/> }

      </VerticalTimeline>

    </div>
  )
}

export default Timeline
