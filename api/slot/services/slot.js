'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
    async findingOne(model_name){
        return await strapi.query(model_name).find({ id: 1 });
    }
    
};