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

export const merge = (body, replace, remove) =>
{
  Object.keys(replace).map( (r) => body[r] = replace[r] );

  remove.map( (r) => delete body[r] );

  return body;
}
