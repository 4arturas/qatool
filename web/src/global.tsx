import moment from "moment";
import {Tag} from "antd";
import React from "react";
import jsonata from "jsonata";

export const HAS_NO_PARENT = 0;
export const EXPERIMENT = 1;
export const COLLECTION = 2;
export const SERVER = 3;
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
  COLLECTION,
  SERVER,
  SUITE,
  CASE,
  BODY,
  TEST,
  REPLACE,
  REMOVE,
  RESULT,
  RESPONSE
];

export const ROLE_ADMIN:string    = 'admin';
export const ROLE_CUSTOMER:string = 'customer';

export const typeIdToName = (typeId: number) =>
{
  switch ( typeId )
  {
    case EXPERIMENT:
      return 'Experiment';
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
    case EXPERIMENT:
      return 'gray';
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
  const step: number = 10;
  switch ( typeId )
  {
    case EXPERIMENT:
      return 0 * step;
    case COLLECTION:
      return 1 * step;
    case SERVER:
      return 1 * step;
    case SUITE:
      return 2 * step;
    case CASE:
      return 3 * step;
    case BODY:
      return 4 * step;
    case TEST:
      return 4 * step;
    case REPLACE:
      return 5 * step;
    case REMOVE:
      return 5 * step;
    case RESULT:
      return 5 * step;
    case RESPONSE:
      return 5 * step;
    default:
      return 400 * step;
  }
}

export const getChildrenTypeIdByParentTypeId = (parentTypeId: number) : Array<number>=>
{
  switch ( parentTypeId )
  {
    case EXPERIMENT:
      return [SERVER,COLLECTION];
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

  const childrenIDArr: Array<string> = [`${childrenFragment}${SERVER}`, `${childrenFragment}${COLLECTION}`, `${childrenFragment}${BODY}`, `${childrenFragment}${TEST}`, `${childrenFragment}${REPLACE}`, `${childrenFragment}${REMOVE}`, `${childrenFragment}${RESULT}`, `${childrenFragment}${RESPONSE}`];
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

export const DEFAULT_TABLE_PAGE_SIZE = 15;

export const mySubstr = (str:string, num:number) => !str ? str : (str.length <= num) ? str : str.substring(0, num) + ' ... ' + str.substring(str.length-num, str.length);

export const dateFormatYYYYMMDDHHmmss = (date:string) => moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss')

export const typeIdToTag = ( typeId ) =>  <Tag color={typeIdToColor(typeId)} style={{color:'black'}}>
                                                {typeIdToName(typeId)}
                                              </Tag>
export const typeIdTagMargin = ( typeId ) =>  <Tag color={typeIdToColor(typeId)} style={{marginLeft: `${typeIdMargin(typeId)}px`, color:'black'}}>
                                                {typeIdToName(typeId)}
                                              </Tag>

export const validateJSONata = ( jSONata: string, jSon: string ) : boolean => {
  try
  {
    return jsonata(jSONata).evaluate( JSON.parse(jSon) );
  }
  catch ( e )
  {
    return false;
  }
}

export const CREATE_QA_OBJECT_RELATIONSHIP_MUTATION = gql`
  mutation CreateQaObjectRelationshipMutation($input: CreateQaObjectRelationshipInput!) {
    createQaObjectRelationship(input: $input) {
      id
      parentId
      childrenId
      childrenObjectTypeId
    }
  }`;

export const prettifyJSon = (json:string): string => {
  if ( json.length === 0 )
    return '';

  try
  {
    return JSON.stringify( JSON.parse(json), null, 2 );
  }
  catch (e)
  {
    return json;
  }
}

