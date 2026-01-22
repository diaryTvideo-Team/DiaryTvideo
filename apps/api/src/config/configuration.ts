export default () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isProduction = process.env.NODE_ENV === "production";

  return {
    nodeEnv: process.env.NODE_ENV || "development",
    isDevelopment,
    isProduction,
    port:
      parseInt(process.env.PORT || "3001", 10) || (isDevelopment ? 3001 : 4000),
    database: {
      url: process.env.DATABASE_URL,
    },
    redis: {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379", 10) || 6379,
      password: process.env.REDIS_PASSWORD || "dev_redis_password",
    },
    jwt: {
      accessSecret:
        process.env.JWT_ACCESS_SECRET ||
        (isDevelopment ? "dev_access_secret" : undefined),
      refreshSecret:
        process.env.JWT_REFRESH_SECRET ||
        (isDevelopment ? "dev_refresh_secret" : undefined),
      accessExpiration: process.env.JWT_ACCESS_EXPIRATION || "15m",
      refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || "7d",
    },
    email: {
      smtp: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.EMAIL_FROM || "noreply@diarytvideo.com",
    },
    frontend: {
      url:
        process.env.FRONTEND_URL ||
        (isDevelopment ? "http://localhost:3000" : "https://diarytvideo.com"),
    },
    aws: {
      region: process.env.AWS_REGION || "ap-northeast-2",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      s3Bucket: process.env.AWS_S3_BUCKET,
    },
  };
};
