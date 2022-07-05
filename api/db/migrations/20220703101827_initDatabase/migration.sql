INSERT INTO QaObjectType (name) VALUES('EXPERIMENT');
INSERT INTO QaObjectType (name) VALUES('COLLECTION');
INSERT INTO QaObjectType (name) VALUES('SERVER');
INSERT INTO QaObjectType (name) VALUES('SUITE');
INSERT INTO QaObjectType (name) VALUES('CASE');
INSERT INTO QaObjectType (name) VALUES('BODY');
INSERT INTO QaObjectType (name) VALUES('TEST');
INSERT INTO QaObjectType (name) VALUES('REPLACE');
INSERT INTO QaObjectType (name) VALUES('REMOVE');
INSERT INTO QaObjectType (name) VALUES('RESULT');
INSERT INTO QaObjectType (name) VALUES('RESPONSE');

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt)
VALUES(3, 'Server Init', 'Server Init', NULL, NULL, NULL, NULL, NULL, 'https://isx.sepagateway.eu/api/Payment/CreatePayment', 'POST', '{"accept":"application/json","Authorization":"Fixed baba","Content-Type":"application/json"}', '1656049916399', '1656065773669');

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt)
VALUES(2, 'Collection Init', 'Collection Init', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1655784679688', '1655784715245');

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt)
VALUES(4, 'Suite Init', 'Suite Init', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1655784693882', '1655785083511');

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt)
VALUES(5, 'Case Init', 'Case Init', 1, 1, 1, NULL, NULL, NULL, NULL, NULL, '1655785397547', '1655879705277');

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt)
VALUES(6, 'Body Init', 'Body Init', NULL, NULL, NULL, '{"paymentId":"IS2206101744211","amount":1.92,"currency":"EUR","unstructuredRemittanceInfo":"deposit for Incredible Wooden Chair","debtorAccount":"CY06904000010000000000201000","creditorAccount":"GB81SEOU00994400000088","debtor":{"address":{"country":"JO","addressLine1":"6388 Jovani Station Apt. 420","addressLine2":"New Leonelstad, MS-26782"},"name":"Einar Stracke","privatePerson":{"dateAndPlaceOfBirth":{"dateOfBirth":"1969-11-16","country":"VN","city":"Chetshire","province":"Cambridgeshire"}}},"creditor":{"name":"Gretchen Bradtke","privatePerson":{"other":{"id":"614-20-9000","type":"NIDN"}}},"ultimateDebtor":{"name":"Murazik - Yundt, and Sons","legalEntity":{"other":{"id":"68966782","type":"COID"}}},"ultimateCreditor":{"name":"Gaylord and Sons, Group","legalEntity":{"other":{"id":"09615755","type":"PRTRY","proprietary":"CUSTOM ID TYPE"}}},"endToEnd":"KDX6080"}', NULL, NULL, NULL, NULL, '1655791719813', '1656311082938');

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt)
VALUES(8, 'Replace Init', 'Replace Init', NULL, NULL, NULL, '{"debtorAccount":"88888"}', NULL, NULL, NULL, NULL, '1655791758915', '1655810858512');

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt)
VALUES(9, 'Remove Init', 'Remove Init', NULL, NULL, NULL, '["amount", "creditor"]', NULL, NULL, NULL, NULL, '1655791816722', '1655808273911');

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt)
VALUES(10, 'Result Init', 'Result Init', NULL, NULL, NULL, '{"fieldErrors":[{"field":"PaymentId","errors":[{"code":"AM05","description":"Duplication"}]},{"field":"DebtorAccount","errors":[{"code":"AC01","description":"Incorrect Account Number"}]},{"field":"DebtorAccount","errors":[{"code":"AC05","description":"Incorrect Account Number"}]}],"dateTime":"2022-06-03T05:52:48.5462361+00:00","status":"Invalid"}', '$count(fieldErrors.errors[description= "Incorrect Account Number"]) = 2', NULL, NULL, NULL, '1655791842882', '1656310847440');

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt)
VALUES(11, 'Response Init', 'Response Init', NULL, NULL, NULL, '{}', NULL, NULL, NULL, NULL, '1655791863133', '1655791863133');

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt)
VALUES(7, 'Test Init', 'Test Init', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1655879611718', '1655988357017');

--------------------------------

INSERT INTO QaObjectRelationship
(parentId, childrenId)
VALUES(2, 3);
INSERT INTO QaObjectRelationship
(parentId, childrenId)
VALUES(3, 4);
INSERT INTO QaObjectRelationship
(parentId, childrenId)
VALUES(4, 5);
INSERT INTO QaObjectRelationship
(parentId, childrenId)
VALUES(4, 10);
INSERT INTO QaObjectRelationship
(parentId, childrenId)
VALUES(10, 6);
INSERT INTO QaObjectRelationship
(parentId, childrenId)
VALUES(10, 7);
INSERT INTO QaObjectRelationship
(parentId, childrenId)
VALUES(10, 8);
INSERT INTO QaObjectRelationship
(parentId, childrenId)
VALUES(10, 9);
