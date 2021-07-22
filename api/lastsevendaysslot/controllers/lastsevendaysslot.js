'use strict';

const { create } = require("../../slot/controllers/slot");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx){
        await strapi.services.lastsevendaysslot.create({
            "username":"srikanth",
            "date": ctx.request.body.date,
            "time": ctx.request.body.time
        })
    },
    async delete(ctx){
        await strapi.services.lastsevendaysslot.delete({})
    }
};
