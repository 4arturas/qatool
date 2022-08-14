// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  qaObject: {
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
  }
})
