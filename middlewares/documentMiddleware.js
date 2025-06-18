// const db = require('../db/connection_new.js');


// const insertQualifications = async(req, res, qualifications) => {
//     let counter = qualifications.qualifications.length

//     qualifications.qualifications.map( async (qua) => {

//         counter --;

//         if (qua.upload_doc !== '') {
//             await db.query("INSERT INTO qualifications(user_id,qualification_type,upload_doc) VALUES(?,?,?)",[res.locals.user_id.id,qua.type,qua.upload_doc]);

//             if(counter === 0){
//                 return true;
//             }
//         }

//     })

//     if(counter === 0){
//         return true;
//     }
// }


// const updateQualifications = async(req, res, qualifications) => {
//     let counter = qualifications.qualifications.length

//     qualifications.qualifications.map( async (qua) => {

//         counter --;

//         if (qua.upload_doc !== '') {
//             await db.query("UPDATE qualifications SET upload_doc = ?  WHERE user_id = ? AND qualification_type = ?",[qua.upload_doc,res.locals.user_id.id,qua.type]);

//             if(counter === 0){
//                 return true;
//             }
//         }

//         // await db.query("UPDATE qualifications SET upload_doc = ?  WHERE user_id = ? AND qualification_type = ?",[qua.upload_doc,res.locals.user_id.id,qua.type]);

//         // counter --;

//         // if(counter === 0){
//         //     return true;
//         // }
//     })

//     if(counter === 0){
//         return true;
//     }
// }


// module.exports = {insertQualifications, updateQualifications}

const db = require('../db/connection_new.js');
const logger = require('../utils/logger.js');


const insertQualifications = async(req, res, qualifications) => {
    let counter = qualifications.qualifications.length

    qualifications.qualifications.map( async (qua) => {

        counter --;

        if (qua.upload_doc !== '') {
          const insert = await db.query("INSERT INTO qualifications(user_id,qualification_type,upload_doc) VALUES(?,?,?)",[res.locals.user_id.id,qua.type,qua.upload_doc]);

            if(counter === 0){
                logger("store_qualification").info("Store Qualifications Update Response : ", insert);
                return true;
            }
        }

    })

    if(counter === 0){

        
        return true;
    }
}


const updateQualifications = async(req, res, qualifications) => {
    let counter = qualifications.qualifications.length

    qualifications.qualifications.map( async (qua) => {

        counter --;

        if (qua.upload_doc !== '') {
           const update = await db.query("UPDATE qualifications SET upload_doc = ?, qualification_type = ?  WHERE user_id = ?",[qua.upload_doc, qua.type, res.locals.user_id.id]);

            if(counter === 0){
                logger("update_qualification").info("Store Qualifications Insert Response : ", update);
                return true;
            }
        }
        else{
            return true;
        }

        // await db.query("UPDATE qualifications SET upload_doc = ?  WHERE user_id = ? AND qualification_type = ?",[qua.upload_doc,res.locals.user_id.id,qua.type]);

        // counter --;

        // if(counter === 0){
        //     return true;
        // }
    })

    if(counter === 0){
        return true;
    }
}


module.exports = {insertQualifications, updateQualifications}