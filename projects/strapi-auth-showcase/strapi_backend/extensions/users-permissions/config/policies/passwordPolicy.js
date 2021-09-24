'use strict';

/**
 * Check if user is approved
 *
 * @param {*} ctx
 * @param {*} next
 */
module.exports = async (ctx, next) => {
  const { password } = ctx.request.body;

  const passwordRegex =
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{8,}';

  if (!password || !password.match(passwordRegex)) {
    return ctx.throw(403, 'Password does not fulfill requirements!');
  }

  return await next(ctx);
};
