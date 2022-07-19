import {db} from "src/lib/db";

export const getOrganizations = async ()  =>
{
  return await db.organization.findMany({});
}

export const createOrganization = async ( { input } ) => {
  return await db.organization.create({
    data: input,
  })
}

export const updateOrganization = async ( { id, input } ) => {
  return await db.organization.update({
    data: {name: input.name},
    where: {id},
  })
}

export const deleteOrganization = async ( { id } ) => {
  const r = await db.organization.delete({
    where: {id},
  });
  return r;
}
