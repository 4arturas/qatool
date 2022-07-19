import {User, UserRole} from "src/models";
import {db} from "src/lib/db";

export const getUser = async ( { id: id } )  =>
{
  return await db.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      email: true,
      deleted: true,
      userRoles:  {
        select: {
          name: true
        }
      },
      orgId: true,
      organization: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
}
export const getUsers = async ()  =>
{
  return await db.user.findMany({
    select: {
      id: true,
      email: true,
      deleted: true,
      orgId: true,
      userRoles:  {
        select: {
          name: true
        }
      },
      organization: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
}

export const deleteUser = async ( { id: id } ) =>
{
  await db.user.update({
    data: { deleted: new Date().toISOString() },
    where: { id },
  });
  return id;
}

export const updateUser = async ( { id, input } ) =>
{
  await db.user.update({
    data: { email: input.email, orgId: input.orgId },
    where: { id },
  })

  const userRoles = await UserRole.where( { userId: id } );
  // Delete
  userRoles.map( async ur => {
    const found = input.userRoles.find( incomingUserRole => incomingUserRole === ur.name );
    if ( !found )
      await ur.destroy();
  });
  // Add
  input.userRoles.map( async incomingUserRole => {
    const found = userRoles.find( ur => ur.name === incomingUserRole );
    if ( !found )
      await UserRole.create({ name: incomingUserRole, userId: id })
  });

  // return user;
  return getUser( { id: id } );
}
