const CreateProfile = require("./Gen/createProfile.js");
const UpdateProfile = require("./Gen/updateProfile.js");
const GetDetails = require("./Gen/getDetails.js");
const EditDetails = require("./Gen/editDetails.js");

//********Experience */
const AddExp = require("./Candidate/experience/addExp.js")
const EditExp = require("./Candidate/experience/editExp.js")
const DelExp = require("./Candidate/experience/delExp.js")
const FetchExp = require("./Candidate/experience/fetch.js")

//*******Availability */
const AddAvail = require("./Candidate/availability/AddAvail.js")

//**Jobs */
const AddJob = require("./Client/Job/add.js")
const EditJob = require("./Client/Job/edit.js")
const DeleteJob = require("./Client/Job/delete.js")
const FetchJob = require("./Client/Job/fetch-job.js")
const FetchJobs = require("./Client/Job/fetch.js")

//**Bookings */
const AddBook = require("./Client/booking/add.js")
const EditBook = require("./Client/booking/edit.js")
const DeleteBook = require("./Client/booking/delete.js")
const FetchBook = require("./Client/booking/fetch-book.js")
const FetchBookings = require("./Client/booking/fetch.js")

const user = new Map([
    ['/create-profile',CreateProfile],
    ['/update-profile',UpdateProfile],
    ['/get-user-details',GetDetails],
    ['/edit-profile',EditDetails],

    //********Experience */
    ['/add-exp',AddExp],
    ['/edit-exp',EditExp],
    ['/delete-exp',DelExp],
    ['/fetch-exp', FetchExp],

    //*******Availability */
    ['/add-avail',AddAvail],

    //*******Jobs */
    ['/add-job', AddJob],
    ['/edit-job', EditJob],
    ['/delete-job', DeleteJob],
    ['/fetch-job', FetchJob],
    ['/fetch-jobs', FetchJobs],

    //*********Bookings */
    ['/add-booking', AddBook],
    ['/edit-booking', EditBook],
    ['/delete-booking', DeleteBook],
    ['/fetch-book', FetchBook],
    ['/fetch-bookings', FetchBookings],
]);

module.exports = user;