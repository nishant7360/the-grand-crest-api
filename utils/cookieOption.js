const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd, // false on localhost
  sameSite: isProd ? "none" : "lax",
  path: "/",
};

module.exports = cookieOptions;
