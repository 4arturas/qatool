import {User, UserRole} from "src/models";

export const getUser = async ( { id: id } )  =>
{
  const userDB = await User.find( id );

  const userRolesDB = await UserRole.where( { userId: id } );
  const userRoles:Array<string> = userRolesDB.map( ur => ur.name );

  const userRet:{ id: number, email: string, deleted: Date, userRoles: Array<string> } = { id: userDB.id, email: userDB.email, deleted: userDB.deleted, userRoles: userRoles };
  return userRet;
}
export const getUsers = async ()  =>
{
  const usersAll = await User.all();
  const userRoleArray = await UserRole.all();

  const users:Array<{id:number, email:string, deleted:Date, userRoles:Array<string>}> = [];

  for ( let i = 0; i < usersAll.length; i++ )
  {
    const u = usersAll[i];
    const userRoles = userRoleArray.filter( ur => ur.userId === u.id ).map( ur => ur.name);
    users.push( { id: u.id, email: u.email, deleted: u.deleted, userRoles: userRoles } );
  }

  return users;
}

export const deleteUser = async ( { id: id } ) =>
{
  const user = await User.find(id)
  await user.update({ deleted: new Date().toISOString(), })
  return id;
}

export const updateUser = async ( { id, input } ) =>
{

  const user = await User.find( id );
  await user.update({ email: input.email })
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

  input.id = id;
  // return user;
  return input;
}
