// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  merge: {
    "__typename": "Merge",
    "caseParent": {
      "__typename": "QaObject",
      "id": 4,
      "typeId": 5,
      "name": "Case Init",
      "executed": null,
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
      ],
      "organization": {
        "__typename": "Organization",
        "id": 1,
        "name": "Org1"
      }
    },
    "body": {
      "__typename": "QaObject",
      "id": 5,
      "typeId": 6,
      "name": "Body Init",
      "executed": null,
      "json": "{\"paymentId\":\"IS2206101744211\",\"amount\":1.92,\"currency\":\"EUR\",\"unstructuredRemittanceInfo\":\"deposit for Incredible Wooden Chair\",\"debtorAccount\":\"CY06904000010000000000201000\",\"creditorAccount\":\"GB81SEOU00994400000088\",\"debtor\":{\"address\":{\"country\":\"JO\",\"addressLine1\":\"6388 Jovani Station Apt. 420\",\"addressLine2\":\"New Leonelstad, MS-26782\"},\"name\":\"Einar Stracke\",\"privatePerson\":{\"dateAndPlaceOfBirth\":{\"dateOfBirth\":\"1969-11-16\",\"country\":\"VN\",\"city\":\"Chetshire\",\"province\":\"Cambridgeshire\"}}},\"creditor\":{\"name\":\"Gretchen Bradtke\",\"privatePerson\":{\"other\":{\"id\":\"614-20-9000\",\"type\":\"NIDN\"}}},\"ultimateDebtor\":{\"name\":\"Murazik - Yundt, and Sons\",\"legalEntity\":{\"other\":{\"id\":\"68966782\",\"type\":\"COID\"}}},\"ultimateCreditor\":{\"name\":\"Gaylord and Sons, Group\",\"legalEntity\":{\"other\":{\"id\":\"09615755\",\"type\":\"PRTRY\",\"proprietary\":\"CUSTOM ID TYPE\"}}},\"endToEnd\":\"KDX6080\"}",
      "parent": [],
      "organization": {
        "__typename": "Organization",
        "id": 1,
        "name": "Org1"
      }
    },
    "test": {
      "__typename": "QaObject",
      "id": 10,
      "typeId": 7,
      "name": "Test Init",
      "executed": null,
      "json": null,
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
      ],
      "organization": {
        "__typename": "Organization",
        "id": 1,
        "name": "Org1"
      }
    },
    "replace": {
      "__typename": "QaObject",
      "id": 6,
      "typeId": 8,
      "name": "Replace Init",
      "executed": null,
      "json": "{\"debtorAccount\":\"88888\"}",
      "parent": [],
      "organization": {
        "__typename": "Organization",
        "id": 1,
        "name": "Org1"
      }
    },
    "remove": {
      "__typename": "QaObject",
      "id": 7,
      "typeId": 9,
      "name": "Remove Init",
      "executed": null,
      "json": "[\"amount\", \"creditor\"]",
      "parent": [],
      "organization": {
        "__typename": "Organization",
        "id": 1,
        "name": "Org1"
      }
    },
    "result": {
      "__typename": "QaObject",
      "id": 8,
      "typeId": 10,
      "name": "Result Init",
      "executed": null,
      "json": "{\"fieldErrors\":[{\"field\":\"PaymentId\",\"errors\":[{\"code\":\"AM05\",\"description\":\"Duplication\"}]},{\"field\":\"DebtorAccount\",\"errors\":[{\"code\":\"AC01\",\"description\":\"Incorrect Account Number\"}]},{\"field\":\"DebtorAccount\",\"errors\":[{\"code\":\"AC05\",\"description\":\"Incorrect Account Number\"}]}],\"dateTime\":\"2022-06-03T05:52:48.5462361+00:00\",\"status\":\"Invalid\"}",
      "parent": [],
      "organization": {
        "__typename": "Organization",
        "id": 1,
        "name": "Org1"
      }
    }
  }
})
