import { db } from 'src/lib/db'
import { DbAuthHandler } from '@redwoodjs/api'
import {UserRole} from "src/models";
import {
  GenericError,
  NotLoggedInError,
  NoUserIdError,
  UserNotFoundError
} from "@redwoodjs/api/dist/functions/dbAuth/errors";
import {authenticator} from "otplib";

export const handler = async (event, context) => {

  const forgotPasswordOptions = {
    // handler() is invoked after verifying that a user was found with the given
    // username. This is where you can send the user an email with a link to
    // reset their password. With the default dbAuth routes and field names, the
    // URL to reset the password will be:
    //
    // https://example.com/reset-password?resetToken=${user.resetToken}
    //
    // Whatever is returned from this function will be returned from
    // the `forgotPassword()` function that is destructured from `useAuth()`
    // You could use this return value to, for example, show the email
    // address in a toast message so the user will know it worked and where
    // to look for the email.
    handler: (user) => {
      return user
    },

    // How long the resetToken is valid for, in seconds (default is 24 hours)
    expires: 60 * 60 * 24,

    errors: {
      // for security reasons you may want to be vague here rather than expose
      // the fact that the email address wasn't found (prevents fishing for
      // valid email addresses)
      usernameNotFound: 'Username not found',
      // if the user somehow gets around client validation
      usernameRequired: 'Username is required',
    },
  }

  const loginOptions = {
    // handler() is called after finding the user that matches the
    // username/password provided at login, but before actually considering them
    // logged in. The `user` argument will be the user in the database that
    // matched the username/password.
    //
    // If you want to allow this user to log in simply return the user.
    //
    // If you want to prevent someone logging in for another reason (maybe they
    // didn't validate their email yet), throw an error and it will be returned
    // by the `logIn()` function from `useAuth()` in the form of:
    // `{ message: 'Error message' }`
    handler: (user) => {
      return user;
    },

    errors: {
      usernameOrPasswordMissing: 'Both username and password are required',
      usernameNotFound: 'Username ${username} not found',
      // For security reasons you may want to make this the same as the
      // usernameNotFound error so that a malicious user can't use the error
      // to narrow down if it's the username or password that's incorrect
      incorrectPassword: 'Incorrect password for ${username}',
    },

    // How long a user will remain logged in, in seconds
    expires: 60 * 60 * 24 * 365 * 10,
  }

  const resetPasswordOptions = {
    // handler() is invoked after the password has been successfully updated in
    // the database. Returning anything truthy will automatically logs the user
    // in. Return `false` otherwise, and in the Reset Password page redirect the
    // user to the login page.
    handler: (user) => {
      return user
    },

    // If `false` then the new password MUST be different than the current one
    allowReusedPassword: true,

    errors: {
      // the resetToken is valid, but expired
      resetTokenExpired: 'resetToken is expired',
      // no user was found with the given resetToken
      resetTokenInvalid: 'resetToken is invalid',
      // the resetToken was not present in the URL
      resetTokenRequired: 'resetToken is required',
      // new password is the same as the old password (apparently they did not forget it)
      reusedPassword: 'Must choose a new password',
    },
  }

  const signupOptions = {
    // Whatever you want to happen to your data on new user signup. Redwood will
    // check for duplicate usernames before calling this handler. At a minimum
    // you need to save the `username`, `hashedPassword` and `salt` to your
    // user table. `userAttributes` contains any additional object members that
    // were included in the object given to the `signUp()` function you got
    // from `useAuth()`.
    //
    // If you want the user to be immediately logged in, return the user that
    // was created.
    //
    // If this handler throws an error, it will be returned by the `signUp()`
    // function in the form of: `{ error: 'Error message' }`.
    //
    // If this returns anything else, it will be returned by the
    // `signUp()` function in the form of: `{ message: 'String here' }`.
    handler: async ({ username, hashedPassword, salt, userAttributes }) => {
      // This function was modified according to the documentation on https://redwoodjs.com/docs/auth/dbauth#signuphandler
      // The 2. case is used, because I am using this function for creating new user
      const newUser = await db.user.create({
        data: {
          email: username,
          hashedPassword: hashedPassword,
          salt: salt,
          // name: userAttributes.name
          orgId: userAttributes.orgId
        },
      });

      const userRoles = userAttributes.userRoles;
      userRoles.map( async roleName => await UserRole.create( { userId: newUser.id, name: roleName } ) );

      return newUser.id;
      // If we use the return below, then user will be logged in after it will be registered
      // return newUser;
    },

    errors: {
      // `field` will be either "username" or "password"
      fieldMissing: '${field} is required',
      usernameTaken: 'Username `${username}` already in use',
    },
  }

  const authHandler = new DbAuthHandler(event, context, {
    // Provide prisma db client
    db: db,

    // The name of the property you'd call on `db` to access your user table.
    // ie. if your Prisma model is named `User` this value would be `user`, as in `db.user`
    authModelAccessor: 'user',

    // A map of what dbAuth calls a field to what your database calls it.
    // `id` is whatever column you use to uniquely identify a user (probably
    // something like `id` or `userId` or even `email`)
    authFields: {
      id: 'id',
      username: 'email',
      hashedPassword: 'hashedPassword',
      qrcode: 'qrcode',
      salt: 'salt',
      resetToken: 'resetToken',
      resetTokenExpiresAt: 'resetTokenExpiresAt',
      mfaSecret: 'mfaSecret',
      mfaSet: 'mfaSet',
    },
    // https://github.com/redwoodjs/redwood/blob/17b9be564d68a140faacac37b3fa8a1db98f7bc0/packages/graphql-server/src/cors.ts#L16
    cors: {
      // 👈 setup your CORS configuration options
      // origin: 'http://localhost:8910',
      origin: '*',
      credentials: true,
      // maxAge: -1,
      // allowedHeaders: 'X-Requested-With, Content-Type, Accept, Origin, Authorization'
    },
    // Specifies attributes on the cookie that dbAuth sets in order to remember
    // who is logged in. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies
    cookie: {
      HttpOnly: true,
      Path: '/',
      SameSite: 'Lax',
      // Secure: process.env.NODE_ENV !== 'development' ? true : false,
      Secure: true,
      Domain: 'qatool.sys'
      // If you need to allow other domains (besides the api side) access to
      // the dbAuth session cookie:
      // Domain: 'example.com',
    },

    forgotPassword: forgotPasswordOptions,
    login: loginOptions,
    resetPassword: resetPasswordOptions,
    signup: signupOptions,
  });


  // Function is taken from here
  // https://github.com/redwoodjs/redwood/blob/main/packages/api/src/functions/dbAuth/DbAuthHandler.ts
  authHandler.login = async function(): Promise<any>
  {
    const {
      username,
      password
    } = this.params;

    const loginData = JSON.parse(username);

    const dbUser = await this._verifyUser(loginData.username, loginData.password);
    if ( dbUser && !dbUser.mfaSet )
      return [{id:dbUser.id, mfa: 0}];

/*    if ( dbUser && !loginData.qrcode )
      return [{id:dbUser.id, mfa: 2}]

    const allGood = authenticator.check(loginData.qrcode, dbUser.mfaSecret);
    if ( !allGood )
      throw new NoUserIdError();*/

    const handlerUser = await this.options.login.handler(dbUser);
    if (handlerUser == null || handlerUser[this.options.authFields.id] == null) {
      throw new NoUserIdError();
      // throw new DbAuthError.NoUserIdError();
    }

    const loginResponse = this._loginResponse(handlerUser);
    return loginResponse;
  }

  authHandler.getToken = async function (): Promise<any> {
    try {
      const user = await this._getCurrentUser()

      // need to return *something* for our existing Authorization header stuff
      // to work, so return the user's ID in case we can use it for something
      // in the future
      return [user[this.options.authFields.id]];
    } catch (e: any) {
      if (e instanceof NotLoggedInError) {
        return this._logoutResponse()
      } else {
        return this._logoutResponse({error: e.message})
      }
    }
  }

  // gets the user from the database and returns only its ID
  authHandler._getCurrentUser = async function(): Promise<any>
  {
    if (!this.session?.id) {
      throw new NotLoggedInError()
    }

    const select = {
      [this.options.authFields.id]: true,
      [this.options.authFields.username]: true,
    }

    if (this.options.webAuthn?.enabled && this.options.authFields.challenge) {
      select[this.options.authFields.challenge] = true
    }

    let user

    try {
      user = await this.dbAccessor.findUnique({
        where: { [this.options.authFields.id]: this.session?.id },
        select,
      })
    } catch (e: any) {
      throw new GenericError(e.message)
    }

    if (!user) {
      throw new UserNotFoundError()
    }

    return user
  }

  return await authHandler.invoke()
}
