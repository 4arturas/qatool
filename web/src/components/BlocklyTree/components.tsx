import {
  BODY,
  CASE,
  COLLECTION,
  EXPERIMENT,
  REMOVE,
  REPLACE, RESPONSE,
  RESULT,
  SERVER,
  SUITE,
  TEST,
  typeIdToColor
} from "src/global";
import {qaObject} from "src/services/qaObjects/qaObjects";

export const comp = [
  {
    "type": "server",
    "message0": "SERVER %1 name: %2 %3 address: %4 %5 method: %6 %7 headers: %8",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "NAME",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "ADDRESS",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "METHOD",
        "options": [
          [
            "POST",
            "POST"
          ],
          [
            "GET",
            "GET"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "HEADERS",
        "text": "{}",
        spellcheck: false
      }
    ],
    "output": ["serverCheck"],
    "colour": `${typeIdToColor(SERVER)}`,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "collection",
    "message0": "COLLECTION %1 name: %2 %3 batch: %4 %5 Suite(s): %6",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "NAME",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_number",
        "name": "BATCH",
        "value": 0
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "SUITES",
        "check": "suite"
      }
    ],
    "previousStatement": "collection",
    "nextStatement": "collection",
    "colour": `${typeIdToColor(COLLECTION)}`,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "suite",
    "message0": "SUITE %1 name %2 %3 batch %4 %5 Case(s): %6",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "NAME",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_number",
        "name": "BATCH",
        "value": 0
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "CASES",
        "check": "case"
      }
    ],
    "previousStatement": "suite",
    "nextStatement": "suite",
    "colour": `${typeIdToColor(SUITE)}`,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "case",
    "message0": "CASE %1 name %2 %3 batch %4 %5 users %6 %7 requests %8 %9 Body %10 Test(s): %11",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "NAME",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_number",
        "name": "BATCH",
        "value": 0
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_number",
        "name": "THREADS",
        "value": 1
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_number",
        "name": "LOOPS",
        "value": 1
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "BODY",
        "check": "bodyCheck"
      },
      {
        "type": "input_statement",
        "name": "TESTS",
        "check": "test"
      }
    ],
    "previousStatement": "case",
    "nextStatement": "case",
    "colour": `${typeIdToColor(CASE)}`,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "body",
    "message0": "BODY %1 name %2 %3 json %4",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "NAME",
        "text": "body"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "JSON",
        "text": "{}",
        spellcheck: false
      }
    ],
    "output": ["bodyCheck"],
    "colour": `${typeIdToColor(BODY)}`,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "test",
    "message0": "TEST %1 name %2 %3 Replace %4 Remove %5 Result %6 Response %7",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "NAME",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "REPLACE",
        "check": "replaceCheck"
      },
      {
        "type": "input_value",
        "name": "REMOVE",
        "check": "removeCheck"
      },
      {
        "type": "input_value",
        "name": "RESULT",
        "check": "resultCheck"
      },
      {
        "type": "input_value",
        "name": "RESPONSE",
        "check": "responseCheck"
      }
    ],
    "previousStatement": "test",
    "nextStatement": "test",
    "colour": `${typeIdToColor(TEST)}`,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "replace",
    "message0": "REPLACE %1 name %2 %3 json %4",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "NAME",
        "text": "replace"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "JSON",
        "text": "{}",
        spellcheck: false
      }
    ],
    "output": ["replaceCheck"],
    "colour": `${typeIdToColor(REPLACE)}`,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "remove",
    "message0": "REMOVE %1 name %2 %3 json %4",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "NAME",
        "text": "remove"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "JSON",
        "text": "[]",
        spellcheck: false
      }
    ],
    "output": ["removeCheck"],
    "colour": `${typeIdToColor(REMOVE)}`,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "result",
    "message0": "RESULT %1 name: %2 %3 json %4 %5 jsonata %6",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "NAME",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "JSON",
        "text": "{}",
        spellcheck: false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "JSONATA",
        "text": "",
        spellcheck: false
      }
    ],
    "output": ["resultCheck"],
    "colour": `${typeIdToColor(RESULT)}`,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "response",
    "message0": "RESPONSE %1 name %2 %3 json %4",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "NAME",
        "text": "replace"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "JSON",
        "text": "{}",
        spellcheck: false
      }
    ],
    "output": ["responseCheck"],
    "colour": `${typeIdToColor(RESPONSE)}`,
    "tooltip": "",
    "helpUrl": ""
  }
];

export const toolbox = {
  kind: 'flyoutToolbox',


  contents: [
    { kind: 'block', type: 'experiment' },
    { kind: 'block', type: 'server' },
    { kind: 'block', type: 'collection' },
    { kind: 'block', type: 'suite' },
    { kind: 'block', type: 'case' },
    { kind: 'block', type: 'body' },
    { kind: 'block', type: 'test' },
    { kind: 'block', type: 'replace' },
    { kind: 'block', type: 'remove' },
    { kind: 'block', type: 'result' },
    { kind: 'block', type: 'response' },
  ]
};

export const restore_Blocks = () =>
{
  return {
    "blocks": {
      "languageVersion": 0,
      "blocks": []
    }
  };
}

export const restore_Object = ( qaObjectParent, qaObject ) => {
  let type;
  switch ( qaObject.typeId )
  {
    case EXPERIMENT: return restore_Experiment( qaObject, qaObject.name);
    case SERVER: type = restore_Server( qaObject, qaObject.name, qaObject.address, qaObject.method, qaObject.header ); break;
    case COLLECTION: type = restore_Collection( qaObject, qaObject.name, qaObject.batchId ); break;
    case SUITE: type = restore_Suite( qaObject, qaObject.name, qaObject.batchId ); break;
    case CASE: type =  restore_Case( qaObject, qaObject.name, qaObject.batchId, qaObject.threads, qaObject.loops ); break;
    case BODY: type = restore_Body( qaObject, qaObject.name, qaObject.json ); break;
    case TEST: type = restore_Test( qaObject, qaObject.name ); break;
    case REPLACE: type = restore_Replace( qaObject, qaObject.name, qaObject.json ); break;
    case REMOVE: type = restore_Remove( qaObject, qaObject.name, qaObject.json ); break;
    case RESULT: type = restore_Result( qaObject, qaObject.name, qaObject.json, qaObject.jsonata ); break;
    case RESPONSE: type = restore_Response( qaObject, qaObject.name, qaObject.json ); break;
    default: throw 'UNDEFINED CASE';
  }

  if ( !qaObjectParent )
    return type;

  return wrap_Block( type );
}

const wrap_Block = ( type ) => {
  return { "block":  type  }
}

const add_Data = ( qaObject ) =>
{
  return JSON.stringify({id:qaObject.id});
}

export const restore_Experiment = ( o, name ) => {
  return {
    "type": "experiment",
    "fields": {"NAME": `${name}`},
    "x": 10,
    "y": 10,
    "inputs": {
      // "SERVER": null,
      // "COLLECTIONS": null
    },
    "data": add_Data(o),
  }
}
export const restore_Server = ( o, name, address, method, headers ) => {
  return {
      "type": "server",
      "fields": {"NAME": `${name}`, "ADDRESS": `${address}`, "METHOD": `${method}`, "HEADERS": `${headers}`},
      "data": add_Data(o)
  };
}
export const restore_Collection = ( o, name:string, batchId:number ) => {
  return {
      "type": "collection",
      "fields": {"NAME": `${name}`, "BATCH": `${batchId}`},
      "next": null,
      "inputs": {
        // "SUITES": null,
      },
      "data": add_Data(o)
  };
}
export const restore_Suite = ( o, name:string, batchId:number ) => {
  return {
      "type": "suite",
      "fields": {"NAME": `${name}`, "BATCH": `${batchId}`},
      "next": null,
      "inputs": {
        // "CASES": null,
      },
      "data": add_Data(o)
  };
}
export const restore_Case = ( o, name:string, batchId:number, threads:number, loops:number ) => {
  return {
      "type": "case",
      "fields": {"NAME": `${name}`, "BATCH": `${batchId}`, "THREADS": `${threads}`, "LOOPS": `${loops}`},
      "next": null,
      "inputs": {
        // "BODY": null,
        // "TESTS": null,
      },
      "data": add_Data(o)
  };
}

export const restore_Body = ( o, name:string, json:string ) => {
  return {
      "type": "body",
      "fields": {"NAME": `${name}`, "JSON": `${json}`},
      "data": add_Data(o)
  };
}

export const restore_Test = ( o, name:string ) => {
  return {
      "type": "test",
      "fields": {"NAME": `${name}`},
      "next": null,
      "inputs": {
        // "REPLACE": null,
        // "REMOVE": null,
        // "RESULT": null,
        // "RESPONSE": null,
      },
      "data": add_Data(o)
  };
}

export const restore_Replace = ( o, name:string, json:string ) => {
  return {
      "type": "replace",
      "fields": {"NAME": `${name}`, "JSON": `${json}`},
      "data": add_Data(o)
    }
}

export const restore_Remove = ( o, name:string, json:string ) => {
  return {
      "type": "remove",
      "fields": {"NAME": `${name}`, "JSON": `${json}`},
      "data": add_Data(o)
  };
}

export const restore_Result = ( o, name:string, json:string, jsonata:string ) => {
  return {
      "type": "result",
      "fields": {"NAME": `${name}`, "JSON": `${json}`, "JSONATA": `${jsonata}`},
      "data": add_Data(o)
  };
}

export const restore_Response = ( o, name:string, json:string ) => {
  return {
      "type": "response",
      "fields": {"NAME": `${name}`, "JSON": `${json}`},
      "data": add_Data(o)
  };
}
