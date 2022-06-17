export const COLLECTION = 1;
export const SERVER = 2;
export const SUITE = 3;
export const CASE = 4;
export const BODY = 5;
export const TEST = 6;
export const REPLACE = 7;
export const REMOVE = 8;
export const RESULT = 9;
export const RESPONSE = 10;

export const objectTypeToName = (typeId: number) =>
{
  switch ( typeId )
  {
    case COLLECTION:
      return 'Collection';
    case SERVER:
      return 'Server';
    case SUITE:
      return 'Suite';
    default:
      return 'Undefined ObjectType';
  }
}
