// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  tree: {
    "__typename": "Tree",
    "parentId": 11,
    "hierarchy": [
      {
        "__typename": "TreeHierarchy",
        "id": 9,
        "parentId": 11,
        "childrenId": 1,
        "childrenObjectTypeId": 2
      },
      {
        "__typename": "TreeHierarchy",
        "id": 10,
        "parentId": 11,
        "childrenId": 2,
        "childrenObjectTypeId": 3
      },
      {
        "__typename": "TreeHierarchy",
        "id": 1,
        "parentId": 2,
        "childrenId": 3,
        "childrenObjectTypeId": 4
      },
      {
        "__typename": "TreeHierarchy",
        "id": 25,
        "parentId": 3,
        "childrenId": 4,
        "childrenObjectTypeId": 5
      },
      {
        "__typename": "TreeHierarchy",
        "id": 27,
        "parentId": 4,
        "childrenId": 5,
        "childrenObjectTypeId": 6
      },
      {
        "__typename": "TreeHierarchy",
        "id": 28,
        "parentId": 4,
        "childrenId": 10,
        "childrenObjectTypeId": 7
      },
      {
        "__typename": "TreeHierarchy",
        "id": 5,
        "parentId": 10,
        "childrenId": 6,
        "childrenObjectTypeId": 8
      },
      {
        "__typename": "TreeHierarchy",
        "id": 6,
        "parentId": 10,
        "childrenId": 7,
        "childrenObjectTypeId": 9
      },
      {
        "__typename": "TreeHierarchy",
        "id": 7,
        "parentId": 10,
        "childrenId": 8,
        "childrenObjectTypeId": 10
      },
      {
        "__typename": "TreeHierarchy",
        "id": 8,
        "parentId": 10,
        "childrenId": 9,
        "childrenObjectTypeId": 11
      },
      {
        "__typename": "TreeHierarchy",
        "id": 29,
        "parentId": 4,
        "childrenId": 12,
        "childrenObjectTypeId": 7
      },
      {
        "__typename": "TreeHierarchy",
        "id": 11,
        "parentId": 12,
        "childrenId": 13,
        "childrenObjectTypeId": 8
      },
      {
        "__typename": "TreeHierarchy",
        "id": 12,
        "parentId": 12,
        "childrenId": 14,
        "childrenObjectTypeId": 9
      },
      {
        "__typename": "TreeHierarchy",
        "id": 14,
        "parentId": 12,
        "childrenId": 15,
        "childrenObjectTypeId": 10
      },
      {
        "__typename": "TreeHierarchy",
        "id": 13,
        "parentId": 12,
        "childrenId": 16,
        "childrenObjectTypeId": 11
      },
      {
        "__typename": "TreeHierarchy",
        "id": 26,
        "parentId": 3,
        "childrenId": 17,
        "childrenObjectTypeId": 5
      },
      {
        "__typename": "TreeHierarchy",
        "id": 30,
        "parentId": 17,
        "childrenId": 18,
        "childrenObjectTypeId": 6
      },
      {
        "__typename": "TreeHierarchy",
        "id": 31,
        "parentId": 17,
        "childrenId": 23,
        "childrenObjectTypeId": 7
      },
      {
        "__typename": "TreeHierarchy",
        "id": 20,
        "parentId": 23,
        "childrenId": 19,
        "childrenObjectTypeId": 8
      },
      {
        "__typename": "TreeHierarchy",
        "id": 19,
        "parentId": 23,
        "childrenId": 20,
        "childrenObjectTypeId": 9
      },
      {
        "__typename": "TreeHierarchy",
        "id": 21,
        "parentId": 23,
        "childrenId": 21,
        "childrenObjectTypeId": 10
      },
      {
        "__typename": "TreeHierarchy",
        "id": 22,
        "parentId": 23,
        "childrenId": 22,
        "childrenObjectTypeId": 11
      }
    ],
    "objects": [
      {
        "__typename": "QaObject",
        "id": 1,
        "typeId": 2,
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
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
        "id": 2,
        "typeId": 3,
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
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": [
          {
            "__typename": "QaObjectRelationship",
            "id": 1,
            "parentId": 2,
            "childrenId": 3,
            "childrenObjectTypeId": 4
          }
        ]
      },
      {
        "__typename": "QaObject",
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
        "updatedAt": "2022-07-31T06:18:26.843Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": [
          {
            "__typename": "QaObjectRelationship",
            "id": 25,
            "parentId": 3,
            "childrenId": 4,
            "childrenObjectTypeId": 5
          },
          {
            "__typename": "QaObjectRelationship",
            "id": 26,
            "parentId": 3,
            "childrenId": 17,
            "childrenObjectTypeId": 5
          }
        ]
      },
      {
        "__typename": "QaObject",
        "id": 4,
        "typeId": 5,
        "name": "Case Init",
        "description": "Case Init",
        "batchId": 1,
        "threads": 5,
        "loops": 3,
        "json": null,
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-06-21T04:23:17.547Z",
        "updatedAt": "2022-08-06T03:44:59.520Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": [
          {
            "__typename": "QaObjectRelationship",
            "id": 27,
            "parentId": 4,
            "childrenId": 5,
            "childrenObjectTypeId": 6
          },
          {
            "__typename": "QaObjectRelationship",
            "id": 28,
            "parentId": 4,
            "childrenId": 10,
            "childrenObjectTypeId": 7
          },
          {
            "__typename": "QaObjectRelationship",
            "id": 29,
            "parentId": 4,
            "childrenId": 12,
            "childrenObjectTypeId": 7
          }
        ]
      },
      {
        "__typename": "QaObject",
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
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
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
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
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
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
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
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
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
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
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
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": [
          {
            "__typename": "QaObjectRelationship",
            "id": 5,
            "parentId": 10,
            "childrenId": 6,
            "childrenObjectTypeId": 8
          },
          {
            "__typename": "QaObjectRelationship",
            "id": 6,
            "parentId": 10,
            "childrenId": 7,
            "childrenObjectTypeId": 9
          },
          {
            "__typename": "QaObjectRelationship",
            "id": 7,
            "parentId": 10,
            "childrenId": 8,
            "childrenObjectTypeId": 10
          },
          {
            "__typename": "QaObjectRelationship",
            "id": 8,
            "parentId": 10,
            "childrenId": 9,
            "childrenObjectTypeId": 11
          }
        ]
      },
      {
        "__typename": "QaObject",
        "id": 11,
        "typeId": 1,
        "name": "Ex",
        "description": null,
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": null,
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-07-30T03:54:22.075Z",
        "updatedAt": "2022-07-30T03:54:22.076Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": [
          {
            "__typename": "QaObjectRelationship",
            "id": 9,
            "parentId": 11,
            "childrenId": 1,
            "childrenObjectTypeId": 2
          },
          {
            "__typename": "QaObjectRelationship",
            "id": 10,
            "parentId": 11,
            "childrenId": 2,
            "childrenObjectTypeId": 3
          }
        ]
      },
      {
        "__typename": "QaObject",
        "id": 12,
        "typeId": 7,
        "name": "Test New",
        "description": null,
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": null,
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-07-30T05:35:07.197Z",
        "updatedAt": "2022-07-30T05:36:21.966Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": [
          {
            "__typename": "QaObjectRelationship",
            "id": 11,
            "parentId": 12,
            "childrenId": 13,
            "childrenObjectTypeId": 8
          },
          {
            "__typename": "QaObjectRelationship",
            "id": 12,
            "parentId": 12,
            "childrenId": 14,
            "childrenObjectTypeId": 9
          },
          {
            "__typename": "QaObjectRelationship",
            "id": 14,
            "parentId": 12,
            "childrenId": 15,
            "childrenObjectTypeId": 10
          },
          {
            "__typename": "QaObjectRelationship",
            "id": 13,
            "parentId": 12,
            "childrenId": 16,
            "childrenObjectTypeId": 11
          }
        ]
      },
      {
        "__typename": "QaObject",
        "id": 13,
        "typeId": 8,
        "name": "Replace New",
        "description": null,
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": "{}",
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-07-30T05:35:25.699Z",
        "updatedAt": "2022-07-30T05:35:25.699Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
        "id": 14,
        "typeId": 9,
        "name": "Remove New",
        "description": null,
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": "[]",
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-07-30T05:35:35.258Z",
        "updatedAt": "2022-07-30T05:35:35.258Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
        "id": 15,
        "typeId": 10,
        "name": "Result New",
        "description": null,
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": "{}",
        "jsonata": "xxx",
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-07-30T05:35:54.254Z",
        "updatedAt": "2022-07-30T05:35:54.254Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
        "id": 16,
        "typeId": 11,
        "name": "Response New",
        "description": null,
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": "{}",
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-07-30T05:36:06.358Z",
        "updatedAt": "2022-07-30T05:36:06.358Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
        "id": 17,
        "typeId": 5,
        "name": "Case New",
        "description": null,
        "batchId": 1,
        "threads": 3,
        "loops": 5,
        "json": null,
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-07-31T06:15:36.615Z",
        "updatedAt": "2022-08-06T03:45:07.735Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": [
          {
            "__typename": "QaObjectRelationship",
            "id": 30,
            "parentId": 17,
            "childrenId": 18,
            "childrenObjectTypeId": 6
          },
          {
            "__typename": "QaObjectRelationship",
            "id": 31,
            "parentId": 17,
            "childrenId": 23,
            "childrenObjectTypeId": 7
          }
        ]
      },
      {
        "__typename": "QaObject",
        "id": 18,
        "typeId": 6,
        "name": "Body New",
        "description": null,
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": "{}",
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-07-31T06:15:49.866Z",
        "updatedAt": "2022-07-31T06:15:49.866Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
        "id": 19,
        "typeId": 8,
        "name": "Replace New",
        "description": "Replace Init",
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": "{\"debtorAccount\":\"88888\"}",
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-07-31T06:16:18.186Z",
        "updatedAt": "2022-07-31T06:16:18.186Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
        "id": 20,
        "typeId": 9,
        "name": "Remove New",
        "description": "Remove Init",
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": "[\"amount\", \"creditor\"]",
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-07-31T06:16:27.984Z",
        "updatedAt": "2022-07-31T06:16:27.984Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
        "id": 21,
        "typeId": 10,
        "name": "Result New",
        "description": "Result Init",
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": "{\"fieldErrors\":[{\"field\":\"PaymentId\",\"errors\":[{\"code\":\"AM05\",\"description\":\"Duplication\"}]},{\"field\":\"DebtorAccount\",\"errors\":[{\"code\":\"AC01\",\"description\":\"Incorrect Account Number\"}]},{\"field\":\"DebtorAccount\",\"errors\":[{\"code\":\"AC05\",\"description\":\"Incorrect Account Number\"}]}],\"dateTime\":\"2022-06-03T05:52:48.5462361+00:00\",\"status\":\"Invalid\"}",
        "jsonata": "$count(fieldErrors.errors[description= \"Incorrect Account Number\"]) = 2",
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-07-31T06:16:37.627Z",
        "updatedAt": "2022-07-31T06:16:37.627Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
        "id": 22,
        "typeId": 11,
        "name": "Response New",
        "description": "Response Init",
        "batchId": null,
        "threads": null,
        "loops": null,
        "json": "{}",
        "jsonata": null,
        "address": null,
        "method": null,
        "header": null,
        "createdAt": "2022-07-31T06:16:44.100Z",
        "updatedAt": "2022-07-31T06:16:44.100Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": []
      },
      {
        "__typename": "QaObject",
        "id": 23,
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
        "createdAt": "2022-07-31T06:17:02.890Z",
        "updatedAt": "2022-07-31T06:17:02.890Z",
        "executed": null,
        "orgId": 1,
        "organization": {
          "__typename": "Organization",
          "id": 1,
          "name": "Org1"
        },
        "parent": [
          {
            "__typename": "QaObjectRelationship",
            "id": 20,
            "parentId": 23,
            "childrenId": 19,
            "childrenObjectTypeId": 8
          },
          {
            "__typename": "QaObjectRelationship",
            "id": 19,
            "parentId": 23,
            "childrenId": 20,
            "childrenObjectTypeId": 9
          },
          {
            "__typename": "QaObjectRelationship",
            "id": 21,
            "parentId": 23,
            "childrenId": 21,
            "childrenObjectTypeId": 10
          },
          {
            "__typename": "QaObjectRelationship",
            "id": 22,
            "parentId": 23,
            "childrenId": 22,
            "childrenObjectTypeId": 11
          }
        ]
      }
    ]
  }
})
