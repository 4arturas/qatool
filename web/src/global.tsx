export const HAS_NO_PARENT = 0;
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

export const typeIdToName = (typeId: number) =>
{
  switch ( typeId )
  {
    case COLLECTION:
      return 'Collection';
    case SERVER:
      return 'Server';
    case SUITE:
      return 'Suite';
    case CASE:
      return 'Case';
    case BODY:
      return 'Body';
    case TEST:
      return 'Test';
    case REPLACE:
      return 'Replace';
    case REMOVE:
      return 'Remove';
    case RESULT:
      return 'Result';
    case RESPONSE:
      return 'Response';
    default:
      return 'Undefined ObjectType - TODO: add name for the Object type';
  }
}

export const typeIdToColor = (typeId: number) =>
{
  switch ( typeId )
  {
    case COLLECTION:
      return '#BEEBE9';
    case SERVER:
      return '#F4DADA';
    case SUITE:
      return '#8AF0CE';
    case CASE:
      return '#F7B385';
    case BODY:
      return '#CDC2AE';
    case TEST:
      return '#F9CEEE';
    case REPLACE:
      return '#EFDAD7';
    case REMOVE:
      return '#FFF89A';
    case RESULT:
      return '#D7DDD5';
    case RESPONSE:
      return '#EBEAF0';
    default:
      return 'black';
  }
}

export const typeIdMargin = (typeId: number) : number =>
{
  const step: number = 20;
  switch ( typeId )
  {
    case COLLECTION:
      return 0 * step;
    case SERVER:
      return 0 * step;
    case SUITE:
      return 1 * step;
    case CASE:
      return 2 * step;
    case BODY:
      return 3 * step;
    case TEST:
      return 3 * step;
    case REPLACE:
      return 4 * step;
    case REMOVE:
      return 4 * step;
    case RESULT:
      return 4 * step;
    case RESPONSE:
      return 4 * step;
    default:
      return 400 * step;
  }
}

export const getChildrenTypeIdByParentTypeId = (parentTypeId: number) : Array<number>=>
{
  switch ( parentTypeId )
  {
    case COLLECTION:
      return [SUITE];
    case SUITE:
      return [CASE];
    case CASE:
      return [BODY,TEST];
    case TEST:
      return [REPLACE,REMOVE,RESULT,RESPONSE]
    case SERVER:
      return [];
    default:
      return [];
  }
}

export const getChildrenFromInput = (input) : Array<number> => {
  let children: Array<number> = [];
  const childrenFragment: string = 'children';
  if ( input[childrenFragment] )
  {
    children = input[childrenFragment];
    delete input[childrenFragment];
  }

  const childrenIDArr: Array<string> = [`${childrenFragment}${BODY}`, `${childrenFragment}${TEST}`, `${childrenFragment}${REPLACE}`, `${childrenFragment}${REMOVE}`, `${childrenFragment}${RESULT}`, `${childrenFragment}${RESPONSE}`];
  childrenIDArr.map( (c) => {
    if ( input[c] )
    {
      children.push( parseInt(input[c]) );
      delete input[c];
    }
  });

  return children;
}

export const mergeObjectsFromTestObject = (body, replace, remove) =>
{
  Object.keys(replace).map( (r) => body[r] = replace[r] );

  remove.map( (r) => delete body[r] );

  return body;
}

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

export const MSG_OUTGOING:number = 1;
export const MSG_INCOMING:number = 2;
export const colorOutgoing = '#D7EEFF';
export const colorIncoming = '#FAFFC7';
export function messageTypeToColor(type:number):string
{
  switch (type) {
    case MSG_INCOMING: return colorIncoming;
    default: return colorOutgoing;
  }
}
export function messageTypeToNameShort(type:number):string
{
  switch (type) {
    case MSG_INCOMING: return 'INC';
    default: return 'OUT';
  }
}

export const TABLE_PAGE_SIZE = 15;
