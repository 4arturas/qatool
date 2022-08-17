import {User, UserRole} from "src/models";
import {db} from "src/lib/db";
import {authenticator} from "otplib";
import QRCode from "qrcode";

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

export const showQrCodeImage = async ( { id: id } ) =>
{
  const user = await db.user.findUnique({
    where: {
      id: id,
    },
    select: {
      email: true,
      deleted: true
    }
  });
  const secret = authenticator.generateSecret();
  await db.user.update({
    data: { mfaSecret: secret },
    where: { id }
  });

  // session.secret = secret;
  const keyUri = authenticator.keyuri(user.email, 'QATool', secret);
  const dataUrl = await QRCode.toDataURL( keyUri );
  console.log( secret );
  // console.log( dataUrl );
  console.log( id );
  return dataUrl;
}

export const setMfaCode = async ( {id:id, qrcode:qrcode} ) =>
{

  const user = await db.user.findUnique({
    where: {
      id: id,
    },
    select: {
      mfaSecret: true
    }
  });

  let allGood: boolean = false;
  try
  {
    allGood = authenticator.check(qrcode, user.mfaSecret);
    await db.user.update({
      data: { mfaSet: allGood },
      where: { id }
    });
  }
  catch ( e )
  {
    allGood = false;
  }
  return allGood ? 1:0;
}
