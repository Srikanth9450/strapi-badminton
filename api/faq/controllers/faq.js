'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find2(ctx){
        var data = await strapi.services.faq.find({})
        return ctx.send(data)

    }
};
