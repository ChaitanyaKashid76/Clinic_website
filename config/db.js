const mysql=require("mysql2");

const db=mysql.createConnection ({
host:"localhost",
user: "root",
password: "root@123",
database: "clinic_db"
});

db.connect((err)=>{
    if(err){
        console.log("DB conncetion failed: ",err);

    }else {
        console.log("🥳 MYSQL connected");
    }
});
modeule.exports= db;