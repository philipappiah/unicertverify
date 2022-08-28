import app from "./app";
import Database from './config/db'

require('dotenv').config();

const MONGO_DATABASE_URL = process.env.MONGO_URL ||  `mongodb://localhost:27017/mydb`
const APP_PORT = process.env.PORT || 4000

new Database(MONGO_DATABASE_URL).connectDataBase()


app.listen(APP_PORT,  () => {
    console.log(`App is running on port ${APP_PORT}`)
})