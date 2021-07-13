'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('date-fns/parseJSON'),
    parseJSON = _require["default"];
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */


var _require2 = require('strapi-utils'),
    parseMultipartData = _require2.parseMultipartData,
    sanitizeEntity = _require2.sanitizeEntity; //sanitizeEntity will stop showing adminstration data


var selecting_timeslots = [];
var d = new Date("2021-07-08 0:00");
var hour = d.getHours();

for (var i = 0; i < 24; i++) {
  if (i < 10) {
    selecting_timeslots.push("0" + (hour + i) + ":00");
  } else {
    selecting_timeslots.push(hour + i + ":00");
  }
}

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */
  ava: function ava(ctx) {
    var req_date, now_date, index2, slots, time_slots, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, slot, index;

    return regeneratorRuntime.async(function ava$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            req_date = ctx.request.body.date_re + " 23:00"; // I set the time to 23 because to compare the date is less than present date or not

            req_date = new Date(req_date);
            now_date = new Date();

            if (!(req_date < now_date)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", ctx.send("no available slots for past"));

          case 5:
            // we need to check if the requested date is current date if yes then we need to delete the timeslots of the past for this day from the list
            if (now_date.getFullYear() + "-" + now_date.getMonth() + "-" + now_date.getDate() == req_date.getFullYear() + "-" + req_date.getMonth() + "-" + req_date.getDate()) {
              console.log("same date");
              index2 = time_slots.findIndex(function (val) {
                return val == now_date.getHours() + 1 + ":00";
              });
              time_slots = time_slots.slice(index2);
            }
            /* console.log(ctx.request.body.date) */

            /* var date = ctx.request.body.date
            console.log(date) */


            _context.next = 8;
            return regeneratorRuntime.awrap(strapi.services.slot.find({
              "date": ctx.request.body.date_re
            }));

          case 8:
            slots = _context.sent;

            if (slots) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", ctx.send(selecting_timeslots));

          case 11:
            time_slots = [].concat(selecting_timeslots);
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 15;

            for (_iterator = slots[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              slot = _step.value;
              index = time_slots.findIndex(function (val) {
                val = val + ":00.000";
                return slot.from == val;
              });
              time_slots.splice(index, 1);
            }

            _context.next = 23;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](15);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 23:
            _context.prev = 23;
            _context.prev = 24;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 26:
            _context.prev = 26;

            if (!_didIteratorError) {
              _context.next = 29;
              break;
            }

            throw _iteratorError;

          case 29:
            return _context.finish(26);

          case 30:
            return _context.finish(23);

          case 31:
            return _context.abrupt("return", ctx.send(time_slots));

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[15, 19, 23, 31], [24,, 26, 30]]);
  },
  create: function create(ctx) {
    var timeslot, _ref, _ref2, slot, entity, _parseMultipartData, data, files;

    return regeneratorRuntime.async(function create$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log(ctx.request.body.date);
            timeslot = new Date(ctx.request.body.date + " " + ctx.request.body.from);

            if (!(timeslot < Date.now())) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return", {
              "past": "you can not book slot in the past"
            });

          case 4:
            _context2.next = 6;
            return regeneratorRuntime.awrap(strapi.services.slot.find({
              "date": ctx.request.body.date,
              "from": ctx.request.body.from
            }));

          case 6:
            _ref = _context2.sent;
            _ref2 = _slicedToArray(_ref, 1);
            slot = _ref2[0];

            if (!slot) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt("return", {
              "error": "already this slot is booked"
            });

          case 11:
            console.log(ctx);

            if (!ctx.is('multipart')) {
              _context2.next = 20;
              break;
            }

            _parseMultipartData = parseMultipartData(ctx), data = _parseMultipartData.data, files = _parseMultipartData.files;
            data.author = ctx.state.user;
            _context2.next = 17;
            return regeneratorRuntime.awrap(strapi.services.slot.create(data, {
              files: files
            }));

          case 17:
            entity = _context2.sent;
            _context2.next = 25;
            break;

          case 20:
            ctx.request.body.users_permissions_user = ctx.state.user;
            console.log(ctx.state.user.username);
            _context2.next = 24;
            return regeneratorRuntime.awrap(strapi.services.slot.create(ctx.request.body));

          case 24:
            entity = _context2.sent;

          case 25:
            return _context2.abrupt("return", sanitizeEntity(entity, {
              model: strapi.models.slot
            }));

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */
  update: function update(ctx) {
    var id, entity, _ref3, _ref4, slot, _parseMultipartData2, data, files;

    return regeneratorRuntime.async(function update$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = ctx.params.id;
            console.log(ctx.state.user.id);
            _context3.next = 4;
            return regeneratorRuntime.awrap(strapi.services.slot.find({
              id: ctx.params.id,
              'users_permissions_user.id': ctx.state.user.id
            }));

          case 4:
            _ref3 = _context3.sent;
            _ref4 = _slicedToArray(_ref3, 1);
            slot = _ref4[0];
            console.log(slot);

            if (slot) {
              _context3.next = 10;
              break;
            }

            return _context3.abrupt("return", ctx.unauthorized("You can't update this entry"));

          case 10:
            if (!ctx.is('multipart')) {
              _context3.next = 17;
              break;
            }

            _parseMultipartData2 = parseMultipartData(ctx), data = _parseMultipartData2.data, files = _parseMultipartData2.files;
            _context3.next = 14;
            return regeneratorRuntime.awrap(strapi.services.slot.update({
              id: id
            }, data, {
              files: files
            }));

          case 14:
            entity = _context3.sent;
            _context3.next = 20;
            break;

          case 17:
            _context3.next = 19;
            return regeneratorRuntime.awrap(strapi.services.slot.update({
              id: id
            }, ctx.request.body));

          case 19:
            entity = _context3.sent;

          case 20:
            return _context3.abrupt("return", sanitizeEntity(entity, {
              model: strapi.models.slot
            }));

          case 21:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  find: function find(ctx) {
    var entity;
    return regeneratorRuntime.async(function find$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log(ctx.state.user.id);
            _context4.next = 3;
            return regeneratorRuntime.awrap(strapi.services.slot.find({
              'users_permissions_user.id': ctx.state.user.id
            }));

          case 3:
            entity = _context4.sent;

            if (entity) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", {
              "bookings": "there is no previous bookings"
            });

          case 6:
            return _context4.abrupt("return", sanitizeEntity(entity, {
              model: strapi.models.slot
            }));

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  count: function count(ctx) {
    var entity;
    return regeneratorRuntime.async(function count$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log(ctx.state.user.id);
            _context5.next = 3;
            return regeneratorRuntime.awrap(strapi.services.slot.find({
              'users_permissions_user.id': ctx.state.user.id
            }));

          case 3:
            entity = _context5.sent;

            if (entity) {
              _context5.next = 6;
              break;
            }

            return _context5.abrupt("return", {
              "bookings": "there is no previous bookings"
            });

          case 6:
            return _context5.abrupt("return", sanitizeEntity(entity.length, {
              model: strapi.models.slot
            }));

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  b: function b(ctx) {
    return regeneratorRuntime.async(function b$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log("working fine");

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    });
  }
};