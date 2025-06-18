const db = require('../db/connection_new.js');


const insert = async (res,req,availability) => {
        const insertion = await db.query(`INSERT INTO ${availability.day}(user_id,bs,m,a_s,a,e,o_n,ad,start_at,start_end) VALUES(?,?,?,?,?,?,?,?,?,?)`,[
                res.locals.user_id.id,
                availability.bs,
                availability.m,
                availability.a_s,
                availability.a,
                availability.e,
                availability.o_n,
                availability.ad,
                availability.start_at,
                availability.start_end
            ]
        );
          
        return {"DB Response : ":insertion, "Availability Data : ": availability, "User ID : ":res.locals.user_id.id ,"User Email : ":req.email};
}

const update = async (res,req,availability) => {
    const updating = await db.query(`UPDATE ${availability.day} SET bs = ?, m=?, a_s = ?, a = ?, e = ?, o_n = ?, ad = ?, start_at = ?, start_end = ? WHERE user_id = ?`,[
            availability.bs,
            availability.m,
            availability.a_s,
            availability.a,
            availability.e,
            availability.o_n,
            availability.ad,
            availability.start_at,
            availability.start_end,
            res.locals.user_id.id
        ]
    ); 

      return {"DB Response : ":updating, "Availability Data : ": availability, "User ID : ":res.locals.user_id.id ,"User Email : ":req.email};
}

const fetch = async (res) => {

    const monday = await db.query(`SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner FROM monday_view WHERE user_id = ?`,[res.locals.user_id.id])

    const tuesday = await db.query(`SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner FROM tuesday_view WHERE user_id = ?`,[res.locals.user_id.id])

    const wednesday = await db.query(`SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner FROM wednesday_view WHERE user_id = ?`,[res.locals.user_id.id])

    const thursday = await db.query(`SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner FROM thursday_view WHERE user_id = ?`,[res.locals.user_id.id])

    const friday = await db.query(`SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner FROM friday_view WHERE user_id = ?`,[res.locals.user_id.id])

    const saturday = await db.query(`SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner FROM saturday_view WHERE user_id = ?`,[res.locals.user_id.id])

    const sunday = await db.query(`SELECT Before_School,Morning,After_School,Afternoon,Evening,Over_Night,After_Dinner FROM sunday_view WHERE user_id = ?`,[res.locals.user_id.id])

    const payload = {
        "Monday" : monday,
        "Tuesday": tuesday,
        "Wednesday": wednesday,
        "Thursday": thursday,
        "Friday" : friday,
        "Saturday" : saturday,
        "Sunday" : sunday
    }

    return payload;
}

module.exports = { insert, update, fetch }