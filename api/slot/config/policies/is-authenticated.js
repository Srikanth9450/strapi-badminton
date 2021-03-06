module.exports = async(ctx, next) => {
    console.log(ctx.state.user)
    if (ctx.state.user) {
        // Go to next policy or will reach the controller's action.
        console.log("authenticated")
        return await next();
    }

    ctx.unauthorized(`You're not logged in!`);
};