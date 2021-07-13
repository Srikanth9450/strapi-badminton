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
    // ...
  });