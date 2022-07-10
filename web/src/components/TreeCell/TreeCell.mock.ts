// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  "tree": {
    parentId: 11,
    "hierarchy": [
      {
        "id": 9,
        "parentId": 11,
        "childrenId": 1
      },
      {
        "id": 10,
        "parentId": 11,
        "childrenId": 2
      },
      {
        "id": 1,
        "parentId": 2,
        "childrenId": 3
      },
      {
        "id": 2,
        "parentId": 3,
        "childrenId": 4
      },
      {
        "id": 3,
        "parentId": 4,
        "childrenId": 5
      },
      {
        "id": 4,
        "parentId": 4,
        "childrenId": 10
      },
      {
        "id": 5,
        "parentId": 10,
        "childrenId": 6
      },
      {
        "id": 6,
        "parentId": 10,
        "childrenId": 7
      },
      {
        "id": 7,
        "parentId": 10,
        "childrenId": 8
      },
      {
        "id": 8,
        "parentId": 10,
        "childrenId": 9
      }
    ],
    "objects": [
      {
        "id": 1,
        "typeId": 3,
        "name": "Server Init",
        "description": "Server Init",
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": null,
        "jsonata": null,
        "address": "https://isx.sepagateway.eu/api/Payment/CreatePayment",
        "method": "POST",
        "header": "{\"accept\":\"application/json\",\"Authorization\":\"Fixed baba\",\"Content-Type\":\"application/json\"}",
        "createdAt": "2022-06-24T05:51:56.399Z",
        "updatedAt": "2022-06-24T10:16:13.669Z",
        "executed": false
      },
      {
        "id": 2,
        "typeId": 2,
        "name": "Collection Init",
        "description": "Collection Init",
        "batchId": 1,
        "threads": null,
        "loops": null,
        "json": null,
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-06-21T04:11:19.688Z",
        "updatedAt": "2022-06-21T04:11:55.245Z",
        "executed": false
      },
      {
        "id": 3,
        "typeId": 4,
        "name": "Suite Init",
        "description": "Suite Init",
        "batchId": 1,
        "threads": null,
        "loops": null,
        "json": null,
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-06-21T04:11:33.882Z",
        "updatedAt": "2022-06-21T04:18:03.511Z",
        "executed": false
      },
      {
        "id": 4,
        "typeId": 5,
        "name": "Case Init",
        "description": "Case Init",
        "batchId": 1,
        "threads": 1,
        "loops": 1,
        "json": null,
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-06-21T04:23:17.547Z",
        "updatedAt": "2022-06-22T06:35:05.277Z",
        "executed": false
      },
      {
        "id": 5,
        "typeId": 6,
        "name": "Body Init",
        "description": "Body Init",
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": "{\"paymentId\":\"IS2206101744211\",\"amount\":1.92,\"currency\":\"EUR\",\"unstructuredRemittanceInfo\":\"deposit for Incredible Wooden Chair\",\"debtorAccount\":\"CY06904000010000000000201000\",\"creditorAccount\":\"GB81SEOU00994400000088\",\"debtor\":{\"address\":{\"country\":\"JO\",\"addressLine1\":\"6388 Jovani Station Apt. 420\",\"addressLine2\":\"New Leonelstad, MS-26782\"},\"name\":\"Einar Stracke\",\"privatePerson\":{\"dateAndPlaceOfBirth\":{\"dateOfBirth\":\"1969-11-16\",\"country\":\"VN\",\"city\":\"Chetshire\",\"province\":\"Cambridgeshire\"}}},\"creditor\":{\"name\":\"Gretchen Bradtke\",\"privatePerson\":{\"other\":{\"id\":\"614-20-9000\",\"type\":\"NIDN\"}}},\"ultimateDebtor\":{\"name\":\"Murazik - Yundt, and Sons\",\"legalEntity\":{\"other\":{\"id\":\"68966782\",\"type\":\"COID\"}}},\"ultimateCreditor\":{\"name\":\"Gaylord and Sons, Group\",\"legalEntity\":{\"other\":{\"id\":\"09615755\",\"type\":\"PRTRY\",\"proprietary\":\"CUSTOM ID TYPE\"}}},\"endToEnd\":\"KDX6080\"}",
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-06-21T06:08:39.813Z",
        "updatedAt": "2022-06-27T06:24:42.938Z",
        "executed": false
      },
      {
        "id": 6,
        "typeId": 8,
        "name": "Replace Init",
        "description": "Replace Init",
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": "{\"debtorAccount\":\"88888\"}",
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-06-21T06:09:18.915Z",
        "updatedAt": "2022-06-21T11:27:38.512Z",
        "executed": false
      },
      {
        "id": 7,
        "typeId": 9,
        "name": "Remove Init",
        "description": "Remove Init",
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": "[\"amount\", \"creditor\"]",
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-06-21T06:10:16.722Z",
        "updatedAt": "2022-06-21T10:44:33.911Z",
        "executed": false
      },
      {
        "id": 8,
        "typeId": 10,
        "name": "Result Init",
        "description": "Result Init",
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": "{\"fieldErrors\":[{\"field\":\"PaymentId\",\"errors\":[{\"code\":\"AM05\",\"description\":\"Duplication\"}]},{\"field\":\"DebtorAccount\",\"errors\":[{\"code\":\"AC01\",\"description\":\"Incorrect Account Number\"}]},{\"field\":\"DebtorAccount\",\"errors\":[{\"code\":\"AC05\",\"description\":\"Incorrect Account Number\"}]}],\"dateTime\":\"2022-06-03T05:52:48.5462361+00:00\",\"status\":\"Invalid\"}",
        "jsonata": "$count(fieldErrors.errors[description= \"Incorrect Account Number\"]) = 2",
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-06-21T06:10:42.882Z",
        "updatedAt": "2022-06-27T06:20:47.440Z",
        "executed": false
      },
      {
        "id": 9,
        "typeId": 11,
        "name": "Response Init",
        "description": "Response Init",
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": "{}",
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-06-21T06:11:03.133Z",
        "updatedAt": "2022-06-21T06:11:03.133Z",
        "executed": false
      },
      {
        "id": 10,
        "typeId": 7,
        "name": "Test Init",
        "description": "Test Init",
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": null,
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-06-22T06:33:31.718Z",
        "updatedAt": "2022-06-23T12:45:57.017Z",
        "executed": false
      },
      {
        "id": 11,
        "typeId": 1,
        "name": "First Experiment",
        "description": "First Experiment",
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": null,
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-07-03T10:40:31.617Z",
        "updatedAt": "2022-07-03T10:40:31.617Z",
        "executed": false
      }
    ]
  }
})
