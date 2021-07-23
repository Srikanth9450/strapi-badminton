'use strict';
const jwt = require("jsonwebtoken")
const { default: parseJSON } = require('date-fns/parseJSON');
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const stripe = require("stripe")("sk_test_51JDYgISDbOAe3XQ7g18GkfDLWEVf2vbvMkaJI7WEoKIxXcnRs09lCISGMAuFG1XEesPqn5GJGPobCqTz7vEwsinX00nBPrFxV6")


//sanitizeEntity will stop showing adminstration data
var selecting_timeslots = []
var d = new Date("2021-07-08 0:00")
var hour = d.getHours()
for (var i = 0; i < 24; i++) {
    if (i < 10) {
        selecting_timeslots.push("0" + (hour + i) + ":00")
    } else {
        selecting_timeslots.push((hour + i) + ":00")
    }

}

module.exports = {
    /**
     * Create a record.
     *
     * @return {Object}
     */



     async previous(ctx) {
        console.log("working")
        let entity;
        console.log(ctx.state.user.id)
        entity = await strapi.services.slot.find({
            'users_permissions_user.id': ctx.state.user.id,
            'payment.cancel':false

        });
        console.log(entity)
        if (!entity) {
            return { "bookings": "there is no previous bookings" }
        }
        return sanitizeEntity(entity, { model: strapi.models.slot })
    },


    async ava(ctx) {
        var time_slots =  [...selecting_timeslots]
        var req_date = ctx.request.body.date_re + " 23:00" // I set the time to 23 because to compare the date is less than present date or not
        req_date = new Date(req_date)
        var now_date = new Date()
        if (req_date < now_date) {
            return ctx.send("no available slots for past")
        }

        // we need to check if the requested date is current date if yes then we need to delete the timeslots of the past for this day from the list
        if (now_date.getFullYear() + "-" + now_date.getMonth() + "-" + now_date.getDate() == req_date.getFullYear() + "-" + req_date.getMonth() + "-" + req_date.getDate()) {
            console.log("same date")
            var index2 = time_slots.findIndex(val => {
                console.log("now",now_date.getHours())
                if (now_date.getHours() < 10){
                   var time_now = "0"+now_date.getHours()
                }else{
                    var time_now = now_date.getHours()
                }
                console.log("now",time_now)
                return val == time_now + ":00"
            })
            time_slots = time_slots.slice(index2+1, )
            console.log(time_slots)
        }
        /* console.log(ctx.request.body.date) */
        /* var date = ctx.request.body.date
        console.log(date) */
        var slots = await strapi.services.slot.find({
            "date": ctx.request.body.date_re
        })
        console.log(slots)
        if (!slots) {
            return ctx.send(time_slots)
        }
        for (var slot of slots) {
            var index = time_slots.findIndex(val => {
                val = val + ":00.000"
                return slot.from == val
            });
            time_slots.splice(index, 1)
        }
        if (time_slots.length == 0){
            return ctx.send({error : "there is no timeslots are available"})
        }
        return ctx.send(time_slots)

    },
    async create(ctx) {
        console.log(ctx.request.body.date)
        var timeslot = new Date(ctx.request.body.date + " " + ctx.request.body.from)
        if (timeslot < Date.now()) {
            return { "past": "you can not book slot in the past" }
        }
        const [slot] = await strapi.services.slot.find({
            "date": ctx.request.body.date,
            "from": ctx.request.body.from
        });
        if (slot) {
            return { "error": "already this slot is booked" };
        }
        let entity;
        const check_trasaction= await strapi.services.slot.find({
            "payment.transaction_id":ctx.request.body.id
        })

        /* console.log("check",check_trasaction)   */      
        if(!check_trasaction.length == 0){
            /* console.log("after length",check_trasaction) */
            return ctx.send("do the payment before continueing")
        }
        else {

            ctx.request.body.users_permissions_user = ctx.state.user;
            console.log(ctx.state.user)
            entity = await strapi.services.slot.create({
                "date":ctx.request.body.date,
                "from":ctx.request.body.from,
                "to":ctx.request.body.to,
                "users_permissions_user":ctx.state.user,
            });
            var id = entity.id
            var entity2 = await strapi.services.payment.update({transaction_id:ctx.request.body.id},{
              /*   "payment":{
                    "id": 2,
                    "username": "a@a.com",
                    "transaction_id": "ch_1JDaudSDbOAe3XQ75aGrEGq5",
                    "amount": 10,
                    "slot": id,
                    "published_at": "2021-07-15T20:12:04.880Z",
                    "created_at": "2021-07-15T20:12:04.885Z",
                    "updated_at": "2021-07-16T05:35:35.500Z"
                } */
                slot:id
            })
        }
        return sanitizeEntity(entity2, { model: strapi.models.slot });
    },

    /**
     * Update a record.
     *
     * @return {Object}
     */
    async update(ctx) {
        const { id } = ctx.params;

        let entity;
        console.log(ctx.state.user.id);
        const [slot] = await strapi.services.slot.find({
            id: ctx.params.id,
            'users_permissions_user.id': ctx.state.user.id,
        });
        console.log(slot)
        if (!slot) {
            return ctx.unauthorized(`You can't update this entry`);
        }

        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services.slot.update({ id }, data, {
                files,
            });
        } else {
            entity = await strapi.services.slot.update({ id }, ctx.request.body);
        }

        return sanitizeEntity(entity, { model: strapi.models.slot });
    },
    
    async count(ctx) {
        let entity;
        console.log(ctx.state.user.id)
        entity = await strapi.services.slot.find({
            'users_permissions_user.id': ctx.state.user.id
        });
        if (!entity) {
            return { "bookings": "there is no previous bookings" }
        }
        return sanitizeEntity(entity.length, { model: strapi.models.slot })

    },
    async b(ctx) {
        var entity = await strapi.services.slot.find({})
        var date = new Date(Date.now())
        console.log(entity)
        var list_of_sots = `<ul>`
        for (var slot of entity){
           if ( slot.created_at.getDate()== date.getDate()){
               list_of_sots+=`<li>Username : ${slot.users_permissions_user.username}    , email : ${slot.users_permissions_user.email}     , timeslot : ${slot.date + "  " +slot.from} </li>`
               
           }
            
        }
        list_of_sots +='</ul>'
        console.log(list_of_sots)
    },
    async findall(ctx){
        const slot = await strapi.services.slot.find({})
        return sanitizeEntity(slot,{ model: strapi.models.slot })
    
    },
    async getonlyone(ctx){
      var result = await  strapi.services.slot.findingOne('slot')
      return ctx.send(result)
    },
     async stripePay(ctx){
        var result;
        const {product,token} = ctx.request.body;
        console.log("product",product)
        console.log("price",token)
        

        console.log( await stripe.customers.create({
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
        .then((customer)=>{
            stripe.charges.create({
                amount:product.price*100,
                description:"badminton slot",
                currency : "INR",
                customer:customer.id,
                receipt_email:token.email,
                description: `purchase of ${product.name}`
            }).then(async (charge)=>{
                var id = charge.id
                var name = charge.billing_details.name
                var price =  product.price
                result = await strapi.services.payment.create({
                    transaction_id :id,
                    username:name

                });
                console.log(result.transaction_id)
                return result.transaction_id
            }).catch(err =>{console.log(err)})
        }))
        
    } 
};