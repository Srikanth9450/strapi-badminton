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


   '1 7 * * * *': async() => {
      // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
      var x= (await gettingUserData()).toString() 

  await strapi.plugins['email'].services.email.send({
    to: 'srikanthh.gattu@gmail.com',
    from: 'srikanthh.gattu@gmail.com',
    subject: 'total bookings and timeslots booked today',
    text: 'Hello world',
    html: x,
  });
    }


};
