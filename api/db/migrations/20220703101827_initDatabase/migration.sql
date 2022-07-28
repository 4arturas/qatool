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
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(1, 2, 'Server Init', 'Server Init', NULL, NULL, NULL, NULL, NULL, 'https://isx.sepagateway.eu/api/Payment/CreatePayment', 'POST', '{"accept":"application/json","Authorization":"Fixed baba","Content-Type":"application/json"}', '1656049916399', '1656065773669', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(2, 3, 'Collection Init', 'Collection Init', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1655784679688', '1655784715245', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(3, 4, 'Suite Init', 'Suite Init', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1655784693882', '1655785083511', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(4, 5, 'Case Init', 'Case Init', 1, 1, 1, NULL, NULL, NULL, NULL, NULL, '1655785397547', '1655879705277', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(5, 6, 'Body Init', 'Body Init', NULL, NULL, NULL, '{"paymentId":"IS2206101744211","amount":1.92,"currency":"EUR","unstructuredRemittanceInfo":"deposit for Incredible Wooden Chair","debtorAccount":"CY06904000010000000000201000","creditorAccount":"GB81SEOU00994400000088","debtor":{"address":{"country":"JO","addressLine1":"6388 Jovani Station Apt. 420","addressLine2":"New Leonelstad, MS-26782"},"name":"Einar Stracke","privatePerson":{"dateAndPlaceOfBirth":{"dateOfBirth":"1969-11-16","country":"VN","city":"Chetshire","province":"Cambridgeshire"}}},"creditor":{"name":"Gretchen Bradtke","privatePerson":{"other":{"id":"614-20-9000","type":"NIDN"}}},"ultimateDebtor":{"name":"Murazik - Yundt, and Sons","legalEntity":{"other":{"id":"68966782","type":"COID"}}},"ultimateCreditor":{"name":"Gaylord and Sons, Group","legalEntity":{"other":{"id":"09615755","type":"PRTRY","proprietary":"CUSTOM ID TYPE"}}},"endToEnd":"KDX6080"}', NULL, NULL, NULL, NULL, '1655791719813', '1656311082938', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(6, 8, 'Replace Init', 'Replace Init', NULL, NULL, NULL, '{"debtorAccount":"88888"}', NULL, NULL, NULL, NULL, '1655791758915', '1655810858512', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(7, 9, 'Remove Init', 'Remove Init', NULL, NULL, NULL, '["amount", "creditor"]', NULL, NULL, NULL, NULL, '1655791816722', '1655808273911', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(8, 10, 'Result Init', 'Result Init', NULL, NULL, NULL, '{"fieldErrors":[{"field":"PaymentId","errors":[{"code":"AM05","description":"Duplication"}]},{"field":"DebtorAccount","errors":[{"code":"AC01","description":"Incorrect Account Number"}]},{"field":"DebtorAccount","errors":[{"code":"AC05","description":"Incorrect Account Number"}]}],"dateTime":"2022-06-03T05:52:48.5462361+00:00","status":"Invalid"}', '$count(fieldErrors.errors[description= "Incorrect Account Number"]) = 2', NULL, NULL, NULL, '1655791842882', '1656310847440', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(9, 11, 'Response Init', 'Response Init', NULL, NULL, NULL, '{}', NULL, NULL, NULL, NULL, '1655791863133', '1655791863133', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(10, 7, 'Test Init', 'Test Init', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1655879611718', '1655988357017', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(11, 1, 'Experiment Init', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1658989022427', '1658989022427', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(12, 2, 'Server Init', 'Server Init', NULL, NULL, NULL, NULL, NULL, 'https://isx.sepagateway.eu/api/Payment/CreatePayment', 'POST', '{"accept":"application/json","Authorization":"Fixed baba","Content-Type":"application/json"}', '1658989076449', '1658989076449', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(13, 3, 'Collection Init', 'Collection Init', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1658989076464', '1658989076464', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(14, 4, 'Suite Complex', 'Suite Init', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1658989076470', '1658989389041', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(15, 5, 'Case Complex', 'Case Init', 1, 1, 1, NULL, NULL, NULL, NULL, NULL, '1658989076477', '1658989351142', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(16, 6, 'Body Complex', 'Body Init', NULL, NULL, NULL, '{"paymentId":"IS2206101744211","amount":1.92,"currency":"EUR","unstructuredRemittanceInfo":"deposit for Incredible Wooden Chair","debtorAccount":"CY06904000010000000000201000","creditorAccount":"GB81SEOU00994400000088","debtor":{"address":{"country":"JO","addressLine1":"6388 Jovani Station Apt. 420","addressLine2":"New Leonelstad, MS-26782"},"name":"Einar Stracke","privatePerson":{"dateAndPlaceOfBirth":{"dateOfBirth":"1969-11-16","country":"VN","city":"Chetshire","province":"Cambridgeshire"}}},"creditor":{"name":"Gretchen Bradtke","privatePerson":{"other":{"id":"614-20-9000","type":"NIDN"}}},"ultimateDebtor":{"name":"Murazik - Yundt, and Sons","legalEntity":{"other":{"id":"68966782","type":"COID"}}},"ultimateCreditor":{"name":"Gaylord and Sons, Group","legalEntity":{"other":{"id":"09615755","type":"PRTRY","proprietary":"CUSTOM ID TYPE"}}},"endToEnd":"KDX6080"}', NULL, NULL, NULL, NULL, '1658989076483', '1658989254549', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(17, 8, 'Replace Complex', 'Replace Complex', NULL, NULL, NULL, '{"debtorAccount":"88888"}', NULL, NULL, NULL, NULL, '1658989076489', '1658989297755', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(18, 9, 'Remove Complex', 'Remove Init', NULL, NULL, NULL, '["amount", "creditor"]', NULL, NULL, NULL, NULL, '1658989076496', '1658989307441', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(19, 10, 'Result Complex', 'Result Init', NULL, NULL, NULL, '{"fieldErrors":[{"field":"PaymentId","errors":[{"code":"AM05","description":"Duplication"}]},{"field":"DebtorAccount","errors":[{"code":"AC01","description":"Incorrect Account Number"}]},{"field":"DebtorAccount","errors":[{"code":"AC05","description":"Incorrect Account Number"}]}],"dateTime":"2022-06-03T05:52:48.5462361+00:00","status":"Invalid"}', '$count(fieldErrors.errors[description= "Incorrect Account Number"]) = 2', NULL, NULL, NULL, '1658989076502', '1658989317406', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(20, 11, 'Response Complex', 'Response Init', NULL, NULL, NULL, '{}', NULL, NULL, NULL, NULL, '1658989076508', '1658989330063', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(21, 7, 'Test Complex', 'Test Init', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1658989076515', '1658989268180', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(22, 1, 'Experiment Complex', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1658989076522', '1658989076522', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(23, 3, 'Collection Complex', NULL, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1658989132394', '1658989169112', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(24, 8, 'Replace Init', 'Replace Init', NULL, NULL, NULL, '{"debtorAccount":"88888"}', NULL, NULL, NULL, NULL, '1658989378128', '1658989378128', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(25, 9, 'Remove Init', 'Remove Init', NULL, NULL, NULL, '["amount", "creditor"]', NULL, NULL, NULL, NULL, '1658989378136', '1658989378136', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(26, 10, 'Result Init', 'Result Init', NULL, NULL, NULL, '{"fieldErrors":[{"field":"PaymentId","errors":[{"code":"AM05","description":"Duplication"}]},{"field":"DebtorAccount","errors":[{"code":"AC01","description":"Incorrect Account Number"}]},{"field":"DebtorAccount","errors":[{"code":"AC05","description":"Incorrect Account Number"}]}],"dateTime":"2022-06-03T05:52:48.5462361+00:00","status":"Invalid"}', '$count(fieldErrors.errors[description= "Incorrect Account Number"]) = 2', NULL, NULL, NULL, '1658989378142', '1658989378142', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(27, 11, 'Response Init', 'Response Init', NULL, NULL, NULL, '{}', NULL, NULL, NULL, NULL, '1658989378148', '1658989378148', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(28, 7, 'Test Init', 'Test Init', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1658989378155', '1658989378156', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(29, 5, 'Case Complex Complex', 'Case Init', 1, 1, 1, NULL, NULL, NULL, NULL, NULL, '1658989378162', '1658989378162', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(30, 6, 'Body Complex', 'Body Init', NULL, NULL, NULL, '{"paymentId":"IS2206101744211","amount":1.92,"currency":"EUR","unstructuredRemittanceInfo":"deposit for Incredible Wooden Chair","debtorAccount":"CY06904000010000000000201000","creditorAccount":"GB81SEOU00994400000088","debtor":{"address":{"country":"JO","addressLine1":"6388 Jovani Station Apt. 420","addressLine2":"New Leonelstad, MS-26782"},"name":"Einar Stracke","privatePerson":{"dateAndPlaceOfBirth":{"dateOfBirth":"1969-11-16","country":"VN","city":"Chetshire","province":"Cambridgeshire"}}},"creditor":{"name":"Gretchen Bradtke","privatePerson":{"other":{"id":"614-20-9000","type":"NIDN"}}},"ultimateDebtor":{"name":"Murazik - Yundt, and Sons","legalEntity":{"other":{"id":"68966782","type":"COID"}}},"ultimateCreditor":{"name":"Gaylord and Sons, Group","legalEntity":{"other":{"id":"09615755","type":"PRTRY","proprietary":"CUSTOM ID TYPE"}}},"endToEnd":"KDX6080"}', NULL, NULL, NULL, NULL, '1658989378168', '1658989378168', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(31, 8, 'Replace Complex', 'Replace Complex', NULL, NULL, NULL, '{"debtorAccount":"88888"}', NULL, NULL, NULL, NULL, '1658989378175', '1658989378175', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(32, 9, 'Remove Complex', 'Remove Init', NULL, NULL, NULL, '["amount", "creditor"]', NULL, NULL, NULL, NULL, '1658989378181', '1658989378181', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(33, 10, 'Result Complex', 'Result Init', NULL, NULL, NULL, '{"fieldErrors":[{"field":"PaymentId","errors":[{"code":"AM05","description":"Duplication"}]},{"field":"DebtorAccount","errors":[{"code":"AC01","description":"Incorrect Account Number"}]},{"field":"DebtorAccount","errors":[{"code":"AC05","description":"Incorrect Account Number"}]}],"dateTime":"2022-06-03T05:52:48.5462361+00:00","status":"Invalid"}', '$count(fieldErrors.errors[description= "Incorrect Account Number"]) = 2', NULL, NULL, NULL, '1658989378186', '1658989378186', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(34, 11, 'Response Complex', 'Response Init', NULL, NULL, NULL, '{}', NULL, NULL, NULL, NULL, '1658989378194', '1658989378194', 1);
INSERT INTO QaObject
(id, typeId, name, description, batchId, threads, loops, json, jsonata, address, "method", header, createdAt, updatedAt, orgId)
VALUES(35, 7, 'Test Complex', 'Test Init', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1658989378200', '1658989378200', 1);


--------------------------------

INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(1, 2, 3, 4);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(2, 3, 4, 5);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(3, 4, 5, 6);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(4, 4, 10, 7);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(5, 10, 6, 8);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(6, 10, 7, 9);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(7, 10, 8, 10);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(8, 10, 9, 11);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(9, 11, 1, 2);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(10, 11, 2, 3);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(11, 22, 12, 2);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(12, 22, 13, 3);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(13, 13, 14, 4);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(22, 22, 23, 3);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(24, 23, 14, 4);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(27, 21, 17, 8);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(28, 21, 18, 9);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(29, 21, 19, 10);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(30, 21, 20, 11);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(31, 15, 16, 6);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(32, 15, 21, 7);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(33, 15, 10, 7);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(34, 29, 28, 7);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(35, 28, 24, 8);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(36, 28, 25, 9);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(37, 28, 26, 10);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(38, 28, 27, 11);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(39, 29, 30, 6);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(40, 29, 35, 7);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(41, 35, 31, 8);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(42, 35, 32, 9);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(43, 35, 33, 10);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(44, 35, 34, 11);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(45, 14, 15, 5);
INSERT INTO QaObjectRelationship
(id, parentId, childrenId, childrenObjectTypeId)
VALUES(46, 14, 29, 5);
