"use strict";

module.exports = function _callee(ctx, next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(ctx.state.user);

          if (!ctx.state.user) {
            _context.next = 6;
            break;
          }

          // Go to next policy or will reach the controller's action.
          console.log("authenticated");
          _context.next = 5;
          return regeneratorRuntime.awrap(next());

        case 5:
          return _context.abrupt("return", _context.sent);

        case 6:
          ctx.unauthorized("You're not logged in!");

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
};