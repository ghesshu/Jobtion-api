const db = require('../db/connection_new.js');


const insertQualifications = async(req, res, qualifications) => {
    let counter = qualifications.qualifications.length

    qualifications.qualifications.map( async (qua) => {

        await db.query("INSERT INTO qualifications(user_id,qualification_type,upload_doc) VALUES(?,?,?)",[res.locals.user_id.id,qua.type,qua.upload_doc]);

        counter --;

        if(counter === 0){
            return true;
        }
    })
}


const updateQualifications = async(req, res, qualifications) => {
    let counter = qualifications.qualifications.length

    qualifications.qualifications.map( async (qua) => {

        await db.query("UPDATE qualifications SET upload_doc = ?  WHERE user_id = ? AND qualification_type = ?",[qua.upload_doc,res.locals.user_id.id,qua.type]);

        counter --;

        if(counter === 0){
            return true;
        }
    })
}


module.exports = {insertQualifications, updateQualifications}