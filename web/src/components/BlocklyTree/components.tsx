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
  typeIdToColor, typeIdToName
} from "src/global";
import Blockly from "blockly";
import * as ReactDOM from "react-dom";
import {Chart} from "react-google-charts";
import React from "react";
import ObjectNewTest from "src/components/ObjectNewTest/ObjectNewTest";

const typeIdToNameToLowerCase = ( typeId:number ) =>
{
  return typeIdToName(typeId).toLowerCase();
}

export const toolbox = {
  kind: 'flyoutToolbox',
  contents: [
    { kind: 'block', type: typeIdToNameToLowerCase(EXPERIMENT) },
    { kind: 'block', type: typeIdToNameToLowerCase(SERVER) },
    { kind: 'block', type: typeIdToNameToLowerCase(COLLECTION) },
    { kind: 'block', type: typeIdToNameToLowerCase(SUITE) },
    { kind: 'block', type: typeIdToNameToLowerCase(CASE) },
    { kind: 'block', type: typeIdToNameToLowerCase(BODY) },
    { kind: 'block', type: typeIdToNameToLowerCase(TEST) },
    { kind: 'block', type: typeIdToNameToLowerCase(REPLACE) },
    { kind: 'block', type: typeIdToNameToLowerCase(REMOVE) },
    { kind: 'block', type: typeIdToNameToLowerCase(RESULT) },
    { kind: 'block', type: typeIdToNameToLowerCase(RESPONSE) },
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
  const description:string = (qaObject.description) ? qaObject.description : '';
  let type;
  switch ( qaObject.typeId )
  {
    case EXPERIMENT:    return restore_Experiment( qaObject, qaObject.name, description );
    case SERVER:        type = restore_Server( qaObject, qaObject.name, description, qaObject.address, qaObject.method, qaObject.header ); break;
    case COLLECTION:    type = restore_Collection( qaObject, qaObject.name, description, qaObject.batchId ); break;
    case SUITE:         type = restore_Suite( qaObject, qaObject.name, description, qaObject.batchId ); break;
    case CASE:          type = restore_Case( qaObject, qaObject.name, description, qaObject.batchId, qaObject.threads, qaObject.loops ); break;
    case BODY:          type = restore_Body( qaObject, qaObject.name, description, qaObject.json ); break;
    case TEST:          type = restore_Test( qaObject, qaObject.name, description); break;
    case REPLACE:       type = restore_Replace( qaObject, qaObject.name, description, qaObject.json ); break;
    case REMOVE:        type = restore_Remove( qaObject, qaObject.name, description, qaObject.json ); break;
    case RESULT:        type = restore_Result( qaObject, qaObject.name, description, qaObject.json, qaObject.jsonata ); break;
    case RESPONSE:      type = restore_Response( qaObject, qaObject.name, description, qaObject.json ); break;
    default:            throw 'UNDEFINED CASE';
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
  return JSON.stringify({id:qaObject.id, typeId:qaObject.typeId});
}

export const restore_Experiment = ( o, name:string, description:string ) => {
  return {
    "type": typeIdToNameToLowerCase(EXPERIMENT),
    "fields": {"NAME": `${name}`, "DESCRIPTION": `${description}`},
    "x": 10,
    "y": 10,
    "inputs": {
      // "SERVER": null,
      // "COLLECTIONS": null
    },
    "data": add_Data(o),
  }
}
export const restore_Server = ( o, name:string, description:string, address:string, method:string, headers:string ) => {
  return {
      "type": typeIdToNameToLowerCase(SERVER),
      "fields": {"NAME": `${name}`, "DESCRIPTION": `${description}`, "ADDRESS": `${address}`, "METHOD": `${method}`, "HEADERS": `${headers}`},
      "data": add_Data(o)
  };
}
export const restore_Collection = ( o, name:string, description:string, batchId:number ) => {
  return {
      "type": typeIdToNameToLowerCase(COLLECTION),
      "fields": {"NAME": `${name}`, "DESCRIPTION": `${description}`, "BATCH": `${batchId}`},
      "next": null,
      "inputs": {
        // "SUITES": null,
      },
      "data": add_Data(o)
  };
}
export const restore_Suite = ( o, name:string, description:string, batchId:number ) => {
  return {
      "type": typeIdToNameToLowerCase(SUITE),
      "fields": {"NAME": `${name}`, "DESCRIPTION": `${description}`, "BATCH": `${batchId}`},
      "next": null,
      "inputs": {
        // "CASES": null,
      },
      "data": add_Data(o)
  };
}
export const restore_Case = ( o, name:string, description:string, batchId:number, threads:number, loops:number ) => {
  return {
      "type": typeIdToNameToLowerCase(CASE),
      "fields": {"NAME": `${name}`, "DESCRIPTION": `${description}`, "BATCH": `${batchId}`, "THREADS": `${threads}`, "LOOPS": `${loops}`},
      "next": null,
      "inputs": {
        // "BODY": null,
        // "TESTS": null,
      },
      "data": add_Data(o)
  };
}

export const restore_Body = ( o, name:string, description:string, json:string ) => {
  return {
      "type": typeIdToNameToLowerCase(BODY),
      "fields": {"NAME": `${name}`, "DESCRIPTION": `${description}`, "JSON": `${json}`},
      "data": add_Data(o)
  };
}

export const restore_Test = ( o, name:string, description:string ) => {
  return {
      "type": typeIdToNameToLowerCase(TEST),
      "fields": {"NAME": `${name}`, "DESCRIPTION": `${description}`},
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

export const restore_Replace = ( o, name:string, description:string, json:string ) => {
  return {
      "type": typeIdToNameToLowerCase(REPLACE),
      "fields": {"NAME": `${name}`, "DESCRIPTION": `${description}`, "JSON": `${json}`},
      "data": add_Data(o)
    }
}

export const restore_Remove = ( o, name:string, description:string, json:string ) => {
  return {
      "type": typeIdToNameToLowerCase(REMOVE),
      "fields": {"NAME": `${name}`, "DESCRIPTION": `${description}`, "JSON": `${json}`},
      "data": add_Data(o)
  };
}

export const restore_Result = ( o, name:string, description:string, json:string, jsonata:string ) => {
  return {
      "type": typeIdToNameToLowerCase(RESULT),
      "fields": {"NAME": `${name}`, "DESCRIPTION": `${description}`, "JSON": `${json}`, "JSONATA": `${jsonata}`},
      "data": add_Data(o)
  };
}

export const restore_Response = ( o, name:string, description:string, json:string ) => {
  return {
      "type": typeIdToNameToLowerCase(RESPONSE),
      "fields": {"NAME": `${name}`, "DESCRIPTION": `${description}`, "JSON": `${json}`},
      "data": add_Data(o)
  };
}

////////////////////////////////////////////////////////////////
export const initBlocklyObjects = ( gen, organizations ) =>
{
  const orgArr = organizations.map( organization => [organization.name, String(organization.id)]);




  init_Experiment( orgArr );
  init_Server( orgArr );
  init_Collection( orgArr );
  init_Suite( orgArr );
  init_Case( orgArr );
  init_Body( orgArr );
  init_Test( orgArr );
  init_Replace( orgArr );
  init_Remove( orgArr );
  init_Result( orgArr );
  init_Response( orgArr );
}

const editImage = {
  "type": "field_image",
  "name": "EDIT",
  "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Edit_icon_%28the_Noun_Project_30184%29.svg/1024px-Edit_icon_%28the_Noun_Project_30184%29.svg.png",
  "height": "20",
  "width": "20",
  "alt": "",
};

Blockly.Extensions.register('edit_button_extension', function () {
  this.getField('EDIT').clickHandler_ = (() => {
    if ( !this.data )
      return;

    const dataJSON = JSON.parse(this.data);
    window.location.href = `/tree/${dataJSON.id}`;
  });
});

const init_Experiment = ( organizations ) =>
{
  const json = {
    "message0": "EXPERIMENT %1 %2 name %3 %4 description %5 %6 organization %7 %8 Server %9 Collection(s): %10",
    "args0": [
      editImage,
      {
        "type": "input_dummy",
      },
      {
        "type": "field_input",
        "name": "NAME",
        "text": "update me"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "DESCRIPTION",
        "text": "update me"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "ORG",
        "options": organizations
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "SERVER",
        "check": "serverCheck"
      },
      {
        "type": "input_statement",
        "name": "COLLECTIONS",
        "check": "collection"
      },
    ],
    "colour": `${typeIdToColor(EXPERIMENT)}`,
    "tooltip": "",
    "helpUrl": "",
    "extensions": [ "edit_button_extension" ]
  };
  Blockly.Blocks[typeIdToNameToLowerCase(EXPERIMENT)] = {
    init: function() {
      this.jsonInit(json);
      // console.log( this.data );
      // console.log( this );
      // Assign 'this' to a variable for use in the tooltip closure below.
      // var thisBlock = this;
      // this.setTooltip(function() {
      //   return 'Add a number to variable "%1".'.replace('%1',
      //     thisBlock.getFieldValue('VAR'));
      // });
    },
    onchange: function ( e )
    {
    }
  };
  // Blockly.JavaScript['experiment'] = function (block) {
  /*gen['experiment'] = function (block) {
    var dropdownLightcolor = block.getFieldValue('NAME');
    // console.log( dropdownLightcolor );
    return 'bubu';

    var dropdownSwitch = block.getFieldValue('switch');

    let code;
    if (dropdownSwitch === 'on')
      code = "document.getElementById('circle').style.backgroundColor = '"+dropdownLightcolor+"'";
    if (dropdownSwitch === 'off')
      code = "document.getElementById('circle').style.backgroundColor = 'black'";

    // return code;
    return 'baba';
  };*/
}

const init_Server = ( organizations ) =>
{
  const json = {
    "message0": "SERVER %1 %2 name %3 %4 description %5 %6 address %7 %8 method %9 %10 headers: %11 %12 organization %13",
    "args0": [
      editImage,
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "NAME",
        "text": "update me"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "DESCRIPTION",
        "text": "update me"
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
      },
      {
        type: "input_dummy"
      },
      { type: "field_dropdown", name: "ORG", options: organizations }
    ],
    "output": ["serverCheck"],
    "colour": `${typeIdToColor(SERVER)}`,
    "tooltip": "",
    "helpUrl": "",
    "extensions": [ "edit_button_extension" ]
  };
  Blockly.Blocks[typeIdToNameToLowerCase(SERVER)] = {
    init: function() {
      this.jsonInit(json);
    }
  };
}

const init_Collection = ( organization ) =>
{
  const json = {
      "type": typeIdToNameToLowerCase(COLLECTION),
      "message0": "COLLECTION %1 %2 name: %3 %4 description: %5 %6 batch: %7 %8 organization %9 %10 Suite(s): %11",
      "args0": [
        editImage,
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "NAME",
          "text": "update me"
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "DESCRIPTION",
          "text": "update me"
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
        { type: "field_dropdown", name: "ORG", options: organization },
        { type: "input_dummy" },
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
      "helpUrl": "",
      "extensions": [ "edit_button_extension" ]
    };
  Blockly.Blocks[typeIdToNameToLowerCase(COLLECTION)] = {
    init: function() {
      this.jsonInit(json);
    }
  };
}

const init_Suite = ( organization ) => {
  const json = {
      "message0": "SUITE %1 %2 name %3 %4 description %5 %6 batch %7 %8 organization %9 %10 Case(s): %11",
      "args0": [
        editImage,
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "NAME",
          "text": "update me"
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "DESCRIPTION",
          "text": "update me"
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
        { type: "field_dropdown", name: "ORG", options: organization },
        { type: "input_dummy" },
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
      "helpUrl": "",
      "extensions": [ "edit_button_extension" ]
    };
  Blockly.Blocks[typeIdToNameToLowerCase(SUITE)] = {
    init: function() {
      this.jsonInit(json);
    }
  };
}

const init_Case = ( organization ) => {
  const json = {
      "message0": "CASE %1 %2 name %3 %4 description %5 %6 batch %7 %8 users %9 %10 requests %11 %12 organization %13 %14 Body %15 Test(s): %16",
      "args0": [
        editImage,
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "NAME",
          "text": "update me"
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "DESCRIPTION",
          "text": "update me"
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
        { type: "field_dropdown", name: "ORG", options: organization },
        { type: "input_dummy" },
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
      "helpUrl": "",
      "extensions": [ "edit_button_extension" ]
    };
  Blockly.Blocks[typeIdToNameToLowerCase(CASE)] = {
    init: function() {
      this.jsonInit(json);
    }
  };
}

const init_Body = ( organization ) => {
  const json = {
      "message0": "BODY %1 %2 name %3 %4 description %5 %6 organization %7 %8 json %9",
      "args0": [
        editImage,
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "NAME",
          "text": "update me"
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "DESCRIPTION",
          "text": "update me"
        },
        { type: "input_dummy" },
        { type: "field_dropdown", name: "ORG", options: organization },
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
      "helpUrl": "",
      "extensions": [ "edit_button_extension" ]
    };
  Blockly.Blocks[typeIdToNameToLowerCase(BODY)] = {
    init: function() {
      this.jsonInit(json);
    }
  };
}

const init_Test = ( organization ) => {
  const json = {
      "message0": "TEST %1 %2 name %3 %4 description %5 %6 organization %7 %8 Replace %9 Remove %10 Result %11 Response %12",
      "args0": [
        editImage,
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "NAME",
          "text": "update me"
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "DESCRIPTION",
          "text": "update me"
        },
        {
          "type": "input_dummy"
        },
        { type: "field_dropdown", name: "ORG", options: organization },
        { type: "input_dummy" },
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
      "helpUrl": "",
      "extensions": [ "edit_button_extension" ]
    };
  Blockly.Blocks[typeIdToNameToLowerCase(TEST)] = {
    init: function() {
      this.jsonInit(json);
    }
  };
}

const init_Replace = ( organization ) => {
  const json = {
      "message0": "REPLACE %1 %2 name %3 %4 description %5 %6 organization %7 %8 json %9",
      "args0": [
        editImage,
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "NAME",
          "text": "update me"
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "DESCRIPTION",
          "text": "update me"
        },
        {
          "type": "input_dummy"
        },
        { type: "field_dropdown", name: "ORG", options: organization },
        { type: "input_dummy" },
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
      "helpUrl": "",
      "extensions": [ "edit_button_extension" ]
    };
  Blockly.Blocks[typeIdToNameToLowerCase(REPLACE)] = {
    init: function() {
      this.jsonInit(json);
    }
  };
}

const init_Remove = ( organization ) => {
  const json = {
      "type": typeIdToNameToLowerCase(REMOVE),
      "message0": "REMOVE %1 %2 name %3 %4 description %5 %6 organization %7 %8 json %9",
      "args0": [
        editImage,
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "NAME",
          "text": "update me"
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "DESCRIPTION",
          "text": "update me"
        },
        {
          "type": "input_dummy"
        },
        { type: "field_dropdown", name: "ORG", options: organization },
        { type: "input_dummy" },
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
      "helpUrl": "",
      "extensions": [ "edit_button_extension" ]
    };
  Blockly.Blocks[typeIdToNameToLowerCase(REMOVE)] = {
    init: function() {
      this.jsonInit(json);
    }
  };
}

const init_Result = ( organization ) => {
  const json = {
      "type": typeIdToNameToLowerCase(RESULT),
      "message0": "RESULT %1 %2 name %3 %4 description %5 %6 organization %7 %8 json %9 %10 jsonata %11",
      "args0": [
        editImage,
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "NAME",
          "text": "update me"
        },
        {
          "type": "input_dummy"
        },
        {
          "type": "field_input",
          "name": "DESCRIPTION",
          "text": "update me"
        },
        {
          "type": "input_dummy"
        },
        { type: "field_dropdown", name: "ORG", options: organization },
        { type: "input_dummy" },
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
          "text": "update me",
          spellcheck: false
        }
      ],
      "output": ["resultCheck"],
      "colour": `${typeIdToColor(RESULT)}`,
      "tooltip": "",
      "helpUrl": "",
      "extensions": [ "edit_button_extension" ]
    };
  Blockly.Blocks[typeIdToNameToLowerCase(RESULT)] = {
    init: function() {
      this.jsonInit(json);
    }
  };
}

const init_Response = ( organization ) => {
  const json =   {
    "message0": "RESPONSE %1 %2 name %3 %4 description %5 %6 organization %7 %8 json %9",
    "args0": [
      editImage,
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "NAME",
        "text": "update me"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "DESCRIPTION",
        "text": "update me"
      },
      {
        "type": "input_dummy"
      },
      { type: "field_dropdown", name: "ORG", options: organization },
      { type: "input_dummy" },
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
    "helpUrl": "",
    "extensions": [ "edit_button_extension" ]
  };
  Blockly.Blocks[typeIdToNameToLowerCase(RESPONSE)] = {
    init: function() {
      this.jsonInit(json);
    }
  };
}
