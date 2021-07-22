'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */
 const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
 function lastSevenDays() {
  var dates = []
  const d = new Date();
  var extra;
  var extra2;
  var subtract_one = 0
  for (var i = 1; i < 8; i++) {
      d.setDate(d.getDate() - subtract_one);
      if (d.getMonth()+1 < 10){
          extra="0"
      }else{
          extra = ""
      }
      if (d.getDate() < 10){
         extra2="0"
     }else{
         extra2 = ""
     }
      dates.push(`${d.getFullYear()}-${extra + (d.getMonth()+1)}-${extra2+d.getDate()}` )
    subtract_one=1
  }
  return dates
 }
 var last = lastSevenDays() 

 async function gettingUserData(){

  var entity = await strapi.services.slot.find({})
  var date = new Date(Date.now())
  var list_of_sots = `<ul>`
  for (var slot of entity){
     if ( slot.created_at.getDate()== date.getDate()){
         list_of_sots+=`<li>Username : ${slot.users_permissions_user.username}    , email : ${slot.users_permissions_user.email}     , timeslot : ${slot.date + "  " +slot.from} </li>`
         
     }
      
  }
  list_of_sots +='</ul>'
  console.log(typeof list_of_sots)
  return list_of_sots
 
 }

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */


   /* '* * * * * *': async() => {
      // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
      var x= (await gettingUserData()).toString() 
      console.log(x)
  await strapi.plugins['email'].services.email.send({
    to: 'srikanth.g@cumulations.com',
    from: 'srikanthh.gattu@gmail.com',
    subject: 'total bookings and timeslots booked today',
    text: 'Hello world',
    html: x,
  });
    } */

    '59 59 23 * * *': async()  =>{
    console.log(last)
    //getting all the slots booked in last seven days
    const slot = await strapi.services.slot.find({ date_in:last })
    //below line is not necessary
    var sanitize =  sanitizeEntity(slot,{ model: strapi.models.slot })
    console.log(sanitize)

    // deleting all the data in the last seven days slots table
    await strapi.services.lastsevendaysslot.delete({})

    // addinng all the slots in last seven days
    for ( var slot_user of sanitize){
    
    await strapi.services.lastsevendaysslot.create({
      "id": sanitize.indexOf(slot_user),
      "username":slot_user.users_permissions_user.username,
      "date":slot_user.date,
      "time":slot_user.from
    })
    }

    }
};
