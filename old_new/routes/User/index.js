const CreateProfile = require("./Gen/createProfile.js");
const UpdateProfile = require("./Gen/updateProfile.js");
const GetDetails = require("./Gen/getDetails.js");
const EditDetails = require("./Gen/editDetails.js");
const DeleteUser = require("./Gen/deleteUser.js");
const FetchRoles = require("./Candidate/getJobRoles.js");

//********Experience */
const AddExp = require("./Candidate/experience/addExp.js")
const EditExp = require("./Candidate/experience/editExp.js")
const DelExp = require("./Candidate/experience/delExp.js")
const FetchExp = require("./Candidate/experience/fetch.js")

//*******Availability */
const AddAvail = require("./Candidate/availability/AddAvail.js")
const FetchAvail = require("./Candidate/availability/fetch.js")

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

//**Qualifications */
const AddQualification = require("./Candidate/qualification/add.js");
const EditQualification = require("./Candidate/qualification/edit.js");
const DeleteQualification = require("./Candidate/qualification/delete.js");
const FetchQualification = require("./Candidate/qualification/fetch-single.js");
const FetchALLQualification = require("./Candidate/qualification/fetch.js");

//*****Candidate Jobs */
const FetchAllJobsForCandidate = require("./Candidate/job/getAllJobs.js");
const FetchAJobForCandidate = require("./Candidate/job/getAJob.js");
const ApplyAJobForCandidate = require("./Candidate/job/applyJob.js");
const FetchAppliedJobsForCandidate = require("./Candidate/job/getAppliedJobs");

const user = new Map([
    ['/create-profile',CreateProfile],
    ['/update-profile',UpdateProfile],
    ['/get-user-details',GetDetails],
    ['/edit-profile',EditDetails],
    ['/delete-user',DeleteUser],
    ['/get-roles', FetchRoles],

    //********Experience */
    ['/add-exp',AddExp],
    ['/edit-exp',EditExp],
    ['/delete-exp',DelExp],
    ['/fetch-exp', FetchExp],

    //*******Availability */
    ['/add-avail',AddAvail],
    ['/fetch-avail', FetchAvail],

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

    //************Qualifications */
    ['/add-qualification', AddQualification],
    ['/edit-qualification', EditQualification],
    ['/delete-qualification', DeleteQualification],
    ['/fetch-qualification', FetchQualification],
    ['/fetch-all-qualification', FetchALLQualification],
    
    //**************Candidate Jobs */
    ['/get-a-job', FetchAJobForCandidate],
    ['/get-all-jobs', FetchAllJobsForCandidate],
    ['/apply-job', ApplyAJobForCandidate],
    ['/fetch-applied-jobs', FetchAppliedJobsForCandidate]
]);

module.exports = user;