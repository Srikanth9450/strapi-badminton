'use strict';

/**
 * my-plugin.js controller
 *
 * @description: A set of functions called "actions" of the `my-plugin` plugin.
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

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  totalbookings: async (ctx) => {
    // Add your own logic here.
    
    // Send 200 `ok`
    console.log(last)
    const slot = await strapi.services.slot.find({ date_in:last })
    return sanitizeEntity(slot,{ model: strapi.models.slot })

    
  },
  maximumBooked : async(ctx)=>{
    var booking_list=[];
    await strapi.services.slot.find({date_in:last}).then( users =>{
      for (var user of users){
        booking_list.push(user.from)
      }
      //checking most repeated element in a list
      var arr1 = booking_list;
      var mf = 1;
      var m = 0;
      var item;
      for (var i = 0; i < arr1.length; i++) {
          for (var j = i; j < arr1.length; j++) {
              if (arr1[i] == arr1[j])
                  m++;
              if (mf < m) {
                  mf = m;
                  item = arr1[i];
              }
          }
          m = 0;
      }
      return ctx.send(item)
      
    })
   
  }
};
