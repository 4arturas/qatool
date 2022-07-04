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
