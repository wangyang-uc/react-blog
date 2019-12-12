const axios = require("axios");
const { Pool } = require("pg");

const pool = new Pool({
  user: "pgUser",
  host: "localhost",
  database: "react-blog",
  password: "mySecret",
  port: 5433
});

//   const query_fetch_user = {
//     // give the query a unique name
//     name: 'fetch-user',
//     text: 'SELECT * FROM user WHERE id = $1',
//     values: [1],
//   }
//   pool
//     .query(query_fetch_user)
//     .then(res => console.log(res.rows[0]))
//     .catch(e => console.error(e.stack))

const insert_user = ({
  name,
  username,
  email,
  phone,
  website,
  address: {
    street,
    suite,
    city,
    zipcode,
    geo: { lat, lng }
  },
  company: { name: cname, catchPhrase, bs }
}) => ({
  name: "insert_user",
  text:
    "INSERT INTO users(name, username,email,phone,website,address_street,address_suite,address_city,address_zipcode,address_geo_lat,address_geo_lng,company_name,company_catch_phrase,company_bs) VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) ON CONFLICT DO NOTHING RETURNING * ",
  value: [
    name,
    username,
    email,
    phone,
    website,
    street,
    suite,
    city,
    zipcode,
    lat,
    lng,
    cname,
    catchPhrase,
    bs
  ]
});

const instance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/"
});

let userData = [];

instance.get("/users").then(res => {
  console.log(res.data[1]);
  userData = [...res.data];
  console.log(userData[1])
});

userData.map(user => {
  queryObj = insert_user(user);
  pool
    .query(queryObj)
    .then(res => console.log(res))
    .catch(e => console.error(e.stack));
});
