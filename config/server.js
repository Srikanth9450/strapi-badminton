module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  cron:{
    enabled:true,
  },
  admin: {

    auth: {
      secret: env('ADMIN_JWT_SECRET', '389bbd7dd3eed49f55ec2a75f77f5478'),
    },
  },
});
