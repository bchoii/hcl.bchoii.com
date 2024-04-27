export const config = {
  root:
    process.env.NODE_ENV == "production"
      ? "https://hcl.bchoii.com"
      : "http://localhost:5173",
};
