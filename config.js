/** Common config for bookstore. */


let DB_URI = `postgresql://stevan:podop123@localhost:5432`;

if (process.env.NODE_ENV === "test") {
  DB_URI = `${DB_URI}/express-bookstore-test`;
} else {
  DB_URI = process.env.DATABASE_URL || `${DB_URI}/express-bookstore`;
}


module.exports = { DB_URI };