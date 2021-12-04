'use strict';

module.exports = {
  /**
   * Promise to edit record
   *
   * @return {Promise}
   */

  async update(params, data) {
    const entry = await strapi
      .query('user', 'users-permissions')
      .update(params, data);

    return entry;
  },
  /**
   * Promise to fetch record
   *
   * @return {Promise}
   */

  findOne(params, populate) {
    return strapi.query('user', 'users-permissions').findOne(params, populate);
  }
};
