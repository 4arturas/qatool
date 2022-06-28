// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  incoming: { id: 88, type: 2, request: null, response: "{\"id\":\"415cfca2-193d-410b-9970-8b3fac6f0715\",\"txnId\":\"D2845BE7472A4489AC0F872FCC46E75B\",\"creditorBIC\":\"CNENPLP1XXX\",\"debtorBIC\":\"ISEMCY22XXX\",\"timestamp\":\"2022-06-28T03:50:02.7047177+00:00\",\"messageId\":\"SI22062810532381\",\"date\":\"2022-06-28\",\"settlementDate\":\"2022-06-28\",\"amount\":0.01,\"currency\":\"EUR\",\"unstructuredRemittanceInfo\":\"withdrawal for Gorgeous Cotton Chips\",\"debtorAccount\":\"CY06904000010000000000201000\",\"creditorAccount\":\"PL47607000031111111111111111\",\"debtor\":{\"address\":{\"country\":\"BS\",\"addressLine1\":\"3718 Erin Bridge Apt. 175\",\"addressLine2\":\"Langworthmouth, PE-66934\"},\"name\":\"Frederic Bins\",\"privatePerson\":{\"dateAndPlaceOfBirth\":{\"dateOfBirth\":\"1974-10-13\",\"country\":\"EC\",\"city\":\"Eugenemouth\",\"province\":\"Buckinghamshire\"}}},\"creditor\":{\"name\":\"Jaylin Wilderman\",\"privatePerson\":{\"other\":{\"id\":\"183-65-1358\",\"type\":\"NIDN\"}}},\"ultimateDebtor\":{\"name\":\"Nicolas, Hills and Murphy, and Sons\",\"legalEntity\":{\"other\":{\"id\":\"73010616\",\"type\":\"COID\"}}},\"ultimateCreditor\":{\"name\":\"Littel LLC, Group\",\"legalEntity\":{\"other\":{\"id\":\"30396517\",\"type\":\"PRTRY\",\"proprietary\":\"CUSTOM ID TYPE\"}}},\"endToEnd\":\"KDX5617\"}", requestDate: null, responseDate: "2022-06-28T03:50:03.268Z", httpCode: null, txnId: "D2845BE7472A4489AC0F872FCC46E75B" },
  outgoing: { type: 1, request: "{\"paymentId\":\"QA-OUT-1656388201082-4613\",\"amount\":0.01,\"currency\":\"EUR\",\"unstructuredRemittanceInfo\":\"withdrawal for Gorgeous Cotton Chips\",\"debtorAccount\":\"CY06904000010000000000201000\",\"creditorAccount\":\"PL47607000031111111111111111\",\"debtor\":{\"address\":{\"country\":\"BS\",\"addressLine1\":\"3718 Erin Bridge Apt. 175\",\"addressLine2\":\"Langworthmouth, PE-66934\"},\"name\":\"Frederic Bins\",\"privatePerson\":{\"dateAndPlaceOfBirth\":{\"dateOfBirth\":\"1974-10-13\",\"country\":\"EC\",\"city\":\"Eugenemouth\",\"province\":\"Buckinghamshire\"}}},\"creditor\":{\"name\":\"Jaylin Wilderman\",\"privatePerson\":{\"other\":{\"id\":\"183-65-1358\",\"type\":\"NIDN\"}}},\"ultimateDebtor\":{\"name\":\"Nicolas, Hills and Murphy, and Sons\",\"legalEntity\":{\"other\":{\"id\":\"73010616\",\"type\":\"COID\"}}},\"ultimateCreditor\":{\"name\":\"Littel LLC, Group\",\"legalEntity\":{\"other\":{\"id\":\"30396517\",\"type\":\"PRTRY\",\"proprietary\":\"CUSTOM ID TYPE\"}}},\"endToEnd\":\"KDX5617\"}", response: "{\"settlementDate\":\"2022-06-28\",\"txnId\":\"D2845BE7472A4489AC0F872FCC46E75B\",\"paymentId\":\"QA-OUT-1656388201082-4613\",\"id\":\"d2845be7-472a-4489-ac0f-872fcc46e75b\",\"dateTime\":\"2022-06-28T03:50:01.6146397+00:00\",\"status\":\"Sent\"}", requestDate: "2022-06-28T03:50:01.082Z", responseDate: "2022-06-28T03:50:27.989Z", httpCode: 200, txnId: "D2845BE7472A4489AC0F872FCC46E75B" },
  JSONata: '(status = \'Settled\') = ($count(settlementDate) > 0)'
})