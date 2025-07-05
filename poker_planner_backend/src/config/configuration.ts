
export default () => ({
    port: parseInt(process.env.PORT ?? "", 10),
    database: {
      host: process.env.DATABASE_HOST ?? '',
      port: parseInt(process.env.DATABASE_PORT ?? "", 10),
      username: process.env.DATABASE_USERNAME ?? '',
      password: process.env.DATABASE_PASSWORD ?? '',
      database: process.env.DATABASE ?? '',
    }
  });
  