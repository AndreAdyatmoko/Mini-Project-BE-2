const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');

const db = require('./models');
// db.sequelize.sync({alter: true});
const {authRouter, blogRouter, categoryRouter, profileRouter, resetPassword, countryRouter} = require('./routes');

app.use("/auth", authRouter);
app.use("/blog", blogRouter);
app.use("/category", categoryRouter);
app.use("/profile", profileRouter);
app.use("/reset", resetPassword);
app.use("/country", countryRouter);
app.use("/blogpict", express.static(path.resolve(__dirname, '../public/images/ImgBlog')))
// Nantinya jika ingin akses blogpictnya buka chrome terus http://localhost:3000/blogpict/namaPictnya (bisa lihat dipostman)


app.listen(3000, () => {
  console.log("Server telah dijalankan pada port 3000");
})