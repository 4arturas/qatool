import {db} from "src/lib/db";

export const getOrganizations = async ()  =>
{
  return await db.organization.findMany({});
}

export const updateOrganization = async ( { id, input } ) => {
  console.log( input );
  return await db.organization.update({
    data: {name: input.name},
    where: {id},
  })
}
