'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async cancel(ctx){
        console.log(ctx.request.body.id)
        var slot = await strapi.services.slot.find({
            "payment.transaction_id":ctx.request.body.id
        })
        console.log(slot)
        var date_now = new Date(Date.now())
        var slot_date=slot[0].date
        slot_date = new Date(slot_date)
        if (slot.date<date_now){
            return ctx.send("past time")
        }else if ((slot_date.getDate()-date_now.getDate())==1){
            if(slot_date.getHours()<date_now.getHours()){
               return ctx.send("you cann't cancel")
            }
            
        }
        await strapi.services.payment.update({
            "transaction_id":ctx.request.body.id

        },{
            "cancel":true
        })

    }
};
