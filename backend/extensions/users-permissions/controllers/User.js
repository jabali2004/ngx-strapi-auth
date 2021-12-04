'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async updateMe(ctx) {
    const { id } = ctx.state.user;

    // Remove all unaccepted data from request
    delete ctx.request.body.provider;
    delete ctx.request.body.resetPasswordToken;
    delete ctx.request.body.confirmationToken;
    delete ctx.request.body.confirmed;
    delete ctx.request.body.blocked;
    delete ctx.request.body.role;

    // Get user service and model ref
    const userService = strapi.plugins['users-permissions'].services.user;
    const userModel = strapi.plugins['users-permissions'].models.user;

    if (ctx.request.body.email === null) {
      delete ctx.request.body.email;
    } else {
      ctx.request.body.email = ctx.request.body.email.toLowerCase();
    }

    if (ctx.request.body.username === null) {
      delete ctx.request.body.username;
    }

    const emailExists = await userService.findOne(
      {
        email: ctx.request.body.email
      },
      []
    );

    const usernameExists = await userService.findOne(
      {
        username: ctx.request.body.username
      },
      []
    );

    if (ctx.request.body.email && emailExists && emailExists.id !== id) {
      return ctx.throw(403, 'Email already exists!');
    }

    if (
      ctx.request.body.username &&
      usernameExists &&
      usernameExists.id !== id
    ) {
      return ctx.throw(403, 'Username already exists!');
    }

    const passwordRegex =
      '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{8,}';

    if (ctx.request.body.password === null) {
      delete ctx.request.body.password;
    } else if (!ctx.request.body.password.match(passwordRegex)) {
      return ctx.throw(403, 'Password does not fulfill requirements!');
    }

    if (ctx.request.body.password) {
      const user = await userService.findOne(id, []);

      if (!ctx.request.body.oldPassword) {
        return ctx.throw(403, 'Old user password is not given!');
      }

      const oldPasswordHash = await strapi.plugins[
        'users-permissions'
      ].services.user.validatePassword(
        ctx.request.body.oldPassword,
        user.password
      );

      if (!oldPasswordHash) {
        return ctx.throw(403, 'Old user password does not match!');
      }

      const passwordHashed = await strapi.plugins[
        'users-permissions'
      ].services.user.hashPassword({
        password: ctx.request.body.password
      });

      ctx.request.body.password = passwordHashed;
    }

    let entity = await userService.update(
      {
        id
      },
      ctx.request.body
    );

    return sanitizeEntity(entity, {
      model: userModel
    });
  }
};
