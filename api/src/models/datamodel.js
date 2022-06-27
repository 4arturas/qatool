module.exports = {
  enums: [],
  models: [
    {
      name: "QaObject",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Int",
          default: {
            name: "autoincrement",
            args: []
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "type",
          kind: "object",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "QaObjectType",
          relationName: "QaObjectToQaObjectType",
          relationFromFields: [
            "typeId"
          ],
          relationToFields: [
            "id"
          ],
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "typeId",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: "Int",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "name",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "description",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "batchId",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Int",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "threads",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Int",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "loops",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Int",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "json",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "jsonata",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "address",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "method",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "header",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "createdAt",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "DateTime",
          default: {
            name: "now",
            args: []
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "updatedAt",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "DateTime",
          isGenerated: false,
          isUpdatedAt: true
        }
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false
    },
    {
      name: "QaObjectType",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Int",
          default: {
            name: "autoincrement",
            args: []
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "name",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "QaObject",
          kind: "object",
          isList: true,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "QaObject",
          relationName: "QaObjectToQaObjectType",
          relationFromFields: [],
          relationToFields: [],
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false
    },
    {
      name: "QaObjectRelationship",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Int",
          default: {
            name: "autoincrement",
            args: []
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "parentId",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Int",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "childrenId",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Int",
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [
        [
          "parentId",
          "childrenId"
        ]
      ],
      uniqueIndexes: [
        {
          name: null,
          fields: [
            "parentId",
            "childrenId"
          ]
        }
      ],
      isGenerated: false
    },
    {
      name: "Message",
      dbName: null,
      fields: [
        {
          name: "id",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: true,
          isReadOnly: false,
          hasDefaultValue: true,
          type: "Int",
          default: {
            name: "autoincrement",
            args: []
          },
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "type",
          kind: "scalar",
          isList: false,
          isRequired: true,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Int",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "request",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "response",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "requestDate",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "DateTime",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "responseDate",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "DateTime",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "httpCode",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "Int",
          isGenerated: false,
          isUpdatedAt: false
        },
        {
          name: "txnId",
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: false,
          hasDefaultValue: false,
          type: "String",
          isGenerated: false,
          isUpdatedAt: false
        }
      ],
      primaryKey: null,
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false
    }
  ],
  types: []
};
