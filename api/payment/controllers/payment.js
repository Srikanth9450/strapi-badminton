'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
 const stripe = require("stripe")("sk_test_51JDYgISDbOAe3XQ7g18GkfDLWEVf2vbvMkaJI7WEoKIxXcnRs09lCISGMAuFG1XEesPqn5GJGPobCqTz7vEwsinX00nBPrFxV6")
var body;

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

    },
    async stripePay(ctx){
        var result;
        const {product,token} = ctx.request.body
        body = ctx.request.body
     await stripe.customers.create({
            email :token.email,
            source:token.id,
            name:"srikanth",
            address:{
                line1: 'vajinepally',
                postal_code: '506168',
                city: 'hyderabad',
                state: 'telangana',
                country: 'India',

            }

        })
        .then(async(customer)=>{
           await stripe.charges.create({
                amount:product.price*100,
                description:"badminton slot",
                currency : "INR",
                customer:customer.id,
                receipt_email:token.email,
                description: `purchase of ${product.name}`
            }).then(async(charge)=>{
                var id = charge.id
                var name = charge.billing_details.name
                var price =  product.price
                var result = await strapi.services.payment.create({
                    transaction_id :id,
                    username:name
                });      
                console.log(id)
                return ctx.send(charge)          
            }).catch(err =>{console.log(err)}) 
            
    
    
    })
   
}

};
