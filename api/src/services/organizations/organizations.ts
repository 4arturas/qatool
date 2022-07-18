import {db} from "src/lib/db";

export const getOrganizations = async ()  =>
{
  return await db.organization.findMany({});
}
