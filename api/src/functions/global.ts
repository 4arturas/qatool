export const EXPERIMENT = 1;
export const SERVER = 2;
export const COLLECTION = 3;
export const SUITE = 4;
export const CASE = 5;
export const BODY = 6;
export const TEST = 7;
export const REPLACE = 8;
export const REMOVE = 9;
export const RESULT = 10;
export const RESPONSE = 11;

export const TYPES = [
  EXPERIMENT,
  SERVER,
  COLLECTION,
  SUITE,
  CASE,
  BODY,
  TEST,
  REPLACE,
  REMOVE,
  RESULT,
  RESPONSE
];

export const MSG_OUTGOING:number = 1;
export const MSG_INCOMING:number = 2;

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export function generatePaymentId(prefix:string):string
{
  const random = getRandomIntInclusive(1000,9999);
  return `${prefix}-${new Date().getTime()}-${random}`;
}
