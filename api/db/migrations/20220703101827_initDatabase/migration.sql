INSERT INTO Organization
(id, name, active, createdAt, updatedAt)
VALUES(1, 'Org1', 1, '2022-07-18 11:27:54', '2022-07-18 11:27:54');
INSERT INTO Organization
(id, name, active, createdAt, updatedAt)
VALUES(2, 'Org2', 1, '2022-07-18 11:28:07', '2022-07-18 11:28:07');

--------------------------------
INSERT INTO "User"
(id, uuid, email, hashedPassword, salt, resetToken, resetTokenExpiresAt, active, orgId)
VALUES(1, 'cl5jhpoms0001jyia8xn2l8gp', 'a', '19d7f55d11286141519a12442c5ff51c6b1997a6fb65fe6766f0f54b6945044b', '0026cf3ae2907da543a795bfb37d3f44', NULL, NULL, 0, 1);
INSERT INTO "User"
(id, uuid, email, hashedPassword, salt, resetToken, resetTokenExpiresAt, active, orgId)
VALUES(2, 'cl5jj1x7v0002boiae0hclijt', 'c', '23a0708921eca9e0a3a9cb4d97307a24eb7ae082a7f86bf458fd34ed2a5ce3a8', 'b8f4487964ed5abf48dbcd0b2a4aae81', NULL, NULL, 0, 1);

--------------------------------
INSERT INTO UserRole
(id, name, userId, active)
VALUES(1, 'admin', 1, 1);

INSERT INTO UserRole
(id, name, userId, active)
VALUES(2, 'customer', 2, 1);
--------------------------------

INSERT INTO QaObjectType (id, name) VALUES(1, 'EXPERIMENT');
INSERT INTO QaObjectType (id, name) VALUES(2, 'SERVER');
INSERT INTO QaObjectType (id, name) VALUES(3, 'COLLECTION');
INSERT INTO QaObjectType (id, name) VALUES(4, 'SUITE');
INSERT INTO QaObjectType (id, name) VALUES(5, 'CASE');
INSERT INTO QaObjectType (id, name) VALUES(6, 'BODY');
INSERT INTO QaObjectType (id, name) VALUES(7, 'TEST');
INSERT INTO QaObjectType (id, name) VALUES(8, 'REPLACE');
INSERT INTO QaObjectType (id, name) VALUES(9, 'REMOVE');
INSERT INTO QaObjectType (id, name) VALUES(10, 'RESULT');
INSERT INTO QaObjectType (id, name) VALUES(11, 'RESPONSE');

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(2, 'Server Init', 'Server Init', NULL, NULL, NULL, NULL, NULL, 'https://isx.sepagateway.eu/api/Payment/CreatePayment', 'POST', '{"accept":"application/json","Authorization":"Fixed baba","Content-Type":"application/json"}', '1656049916399', '1656065773669', 1);

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(3, 'Collection Init', 'Collection Init', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1655784679688', '1655784715245', 1);

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(4, 'Suite Init', 'Suite Init', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1655784693882', '1655785083511', 1);

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(5, 'Case Init', 'Case Init', 1, 1, 1, NULL, NULL, NULL, NULL, NULL, '1655785397547', '1655879705277', 1);

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(6, 'Body Init', 'Body Init', NULL, NULL, NULL, '{"paymentId":"IS2206101744211","amount":1.92,"currency":"EUR","unstructuredRemittanceInfo":"deposit for Incredible Wooden Chair","debtorAccount":"CY06904000010000000000201000","creditorAccount":"GB81SEOU00994400000088","debtor":{"address":{"country":"JO","addressLine1":"6388 Jovani Station Apt. 420","addressLine2":"New Leonelstad, MS-26782"},"name":"Einar Stracke","privatePerson":{"dateAndPlaceOfBirth":{"dateOfBirth":"1969-11-16","country":"VN","city":"Chetshire","province":"Cambridgeshire"}}},"creditor":{"name":"Gretchen Bradtke","privatePerson":{"other":{"id":"614-20-9000","type":"NIDN"}}},"ultimateDebtor":{"name":"Murazik - Yundt, and Sons","legalEntity":{"other":{"id":"68966782","type":"COID"}}},"ultimateCreditor":{"name":"Gaylord and Sons, Group","legalEntity":{"other":{"id":"09615755","type":"PRTRY","proprietary":"CUSTOM ID TYPE"}}},"endToEnd":"KDX6080"}', NULL, NULL, NULL, NULL, '1655791719813', '1656311082938', 1);

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(8, 'Replace Init', 'Replace Init', NULL, NULL, NULL, '{"debtorAccount":"88888"}', NULL, NULL, NULL, NULL, '1655791758915', '1655810858512', 1);

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(9, 'Remove Init', 'Remove Init', NULL, NULL, NULL, '["amount", "creditor"]', NULL, NULL, NULL, NULL, '1655791816722', '1655808273911', 1);

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(10, 'Result Init', 'Result Init', NULL, NULL, NULL, '{"fieldErrors":[{"field":"PaymentId","errors":[{"code":"AM05","description":"Duplication"}]},{"field":"DebtorAccount","errors":[{"code":"AC01","description":"Incorrect Account Number"}]},{"field":"DebtorAccount","errors":[{"code":"AC05","description":"Incorrect Account Number"}]}],"dateTime":"2022-06-03T05:52:48.5462361+00:00","status":"Invalid"}', '$count(fieldErrors.errors[description= "Incorrect Account Number"]) = 2', NULL, NULL, NULL, '1655791842882', '1656310847440', 1);

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(11, 'Response Init', 'Response Init', NULL, NULL, NULL, '{}', NULL, NULL, NULL, NULL, '1655791863133', '1655791863133', 1);

INSERT INTO QaObject
(typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(7, 'Test Init', 'Test Init', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1655879611718', '1655988357017', 1);

--------------------------------

INSERT INTO QaObjectRelationship
(parentId, childrenId, childrenObjectTypeId)
VALUES(2, 3, 4);
INSERT INTO QaObjectRelationship
(parentId, childrenId, childrenObjectTypeId)
VALUES(3, 4, 5);
INSERT INTO QaObjectRelationship
(parentId, childrenId, childrenObjectTypeId)
VALUES(4, 5, 6);
INSERT INTO QaObjectRelationship
(parentId, childrenId, childrenObjectTypeId)
VALUES(4, 10, 7);
INSERT INTO QaObjectRelationship
(parentId, childrenId, childrenObjectTypeId)
VALUES(10, 6, 8);
INSERT INTO QaObjectRelationship
(parentId, childrenId, childrenObjectTypeId)
VALUES(10, 7, 9);
INSERT INTO QaObjectRelationship
(parentId, childrenId, childrenObjectTypeId)
VALUES(10, 8, 10);
INSERT INTO QaObjectRelationship
(parentId, childrenId, childrenObjectTypeId)
VALUES(10, 9, 11);




