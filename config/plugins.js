module.exports = ({ env }) => ({
    // ...
    email: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: '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',
      },
      settings: {
        defaultFrom: 'srikanthh.gattu@gmail.com',
        defaultReplyTo: 'srikanthh.gattu@gmail.com',
        testAddress: 'srikanthh.gattu@gmail.com',
      },
    },
    upload: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AKIA3UHUR4XOTC6K3MPC'),
        secretAccessKey: env('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'),
        region: env('us-east-2'),
        params: {
          Bucket: env('strapi-images-srikanth'),
        },
      },
    },
    // ...
   
  });