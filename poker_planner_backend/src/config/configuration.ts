
export default () => ({
    port: parseInt(process.env.PORT ?? '4000', 10) || 4000,
    database: {
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10) || 5432,
      username: process.env.DATABASE_USERNAME ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'postgres',
      database: process.env.DATABASE_DATABASE ?? 'poker_planner',
    }
  });
  