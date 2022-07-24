export const comp = [
  {
    "type": "experiment",
    "message0": "EXPERIMENT %1 Server %2 Collection(s): %3",
    "args0": [
      {
        "type": "input_dummy",
      },
      {
        "type": "input_value",
        "name": "SERVER",
        "check": "server"
      },
      {
        "type": "input_statement",
        "name": "COLLECTIONS",
        "check": ["collection"]
      }
    ],
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },
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
        "type": "field_multilinetext",
        "name": "HEADERS",
        "text": "{}",
        spellcheck: false
      }
    ],
    "output": null,
    "colour": '100',
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
        "name": "SUITES"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
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
        "name": "CASES"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
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
        "name": "BODY"
      },
      {
        "type": "input_statement",
        "name": "TESTS"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
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
        "type": "field_multilinetext",
        "name": "JSON",
        "text": "{}",
        spellcheck: false
      }
    ],
    "output": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "test",
    "message0": "TEST %1 Replace %2 Remove %3",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "REPLACE"
      },
      {
        "type": "input_value",
        "name": "REMOVE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
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
        "type": "field_multilinetext",
        "name": "JSON",
        "text": "{}",
        spellcheck: false
      }
    ],
    "output": null,
    "colour": 230,
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
        "type": "field_multilinetext",
        "name": "JSON",
        "text": "[]",
        spellcheck: false
      }
    ],
    "output": null,
    "colour": 230,
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
  ]
};
