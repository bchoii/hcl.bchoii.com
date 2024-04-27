export const config = {
  root:
    process.env.NODE_ENV == "production"
      ? "https://hcl-hackathon.bchoii.com"
      : "http://localhost:5173",
};
