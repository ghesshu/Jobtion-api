const CreateProfile = require("./Gen/createProfile.js");
const UpdateProfile = require("./Gen/updateProfile.js");
const GetDetails = require("./Gen/getDetails.js");
const EditDetails = require("./Gen/editDetails.js");
const ChangePassword = require("./Gen/changePassword.js");
const DeleteUser = require("./Gen/deleteUser.js");
const UpdateEmail = require("./Gen/updateEmail.js");
const FetchRoles = require("./Candidate/getJobRoles.js");


//********Experience */
const AddExp = require("./Candidate/experience/addExp.js")
const EditExp = require("./Candidate/experience/editExp.js")
const DelExp = require("./Candidate/experience/delExp.js")
const FetchExp = require("./Candidate/experience/fetch.js")

//*******Availability */
const AddAvail = require("./Candidate/availability/AddAvail.js")
const FetchAvail = require("./Candidate/availability/fetch.js")
const JobDaySession = require("./Candidate/availability/DaySession.js")
const FetchDaySession = require("./Candidate/availability/fetch_day_session.js")

//**Jobs */
const AddJob = require("./Client/Job/add.js")
const EditJob = require("./Client/Job/edit.js")
const DeleteJob = require("./Client/Job/delete.js")
const FetchJob = require("./Client/Job/fetch-job.js")
const FetchJobs = require("./Client/Job/fetch.js")
const DaySessionsJobs = require("./Client/Job/day-sessions.js")

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
const Payslip = require("./Candidate/payslip.js")
const GetJobDays = require("./Candidate/job/getJobDays.js")

//******Candidate Bookings */
const FetchCandidateBookings = require("./Candidate/book/getBooking.js");
const CandidateBookings = require("./Candidate/book/booking.js");


//*****Admin Routes */
const GetAllCandidates = require("./Admin/Users/get-all-candidate.js");
const GetAllClients = require("./Admin/Users/get-all-client.js");
const GetAllPermanentJobs = require("./Admin/jobs/get-all-perm.js");
const GetAllTemporaryJobs = require("./Admin/jobs/get-all-temp.js");
const GetAllJobs = require("./Admin/jobs/get-all-jobs.js");
const GetReport = require("./Admin/Users/get-report.js");
const DownloadReport = require("./Admin/Users/download-report.js");

//******Admin Clients/Candidates Routes */
const AddNewClient = require("./Admin/Users/Client/add.js");
const FetchSingleClient = require("./Admin/Users/Client/fetch.js");
const UpdateNewClient = require("./Admin/Users/Client/update.js");
const DeleteClient = require("./Admin/Users/Client/delete.js");
const BringBackClient = require("./Admin/Users/Client/bring-back.js");
const FetchSingleCandidate = require("./Admin/Users/Candidate/fetch-single-candidate.js");
const VerifyCandidate = require("./Admin/Users/Candidate/verify.js");
const UploadCandidateDoc = require("./Admin/Users/Candidate/upload-ref.js");
const UploadCandidateDoc_other = require("./Admin/Users/Candidate/upload-other.js");
const DownloadFiles = require("./Admin/Users/Candidate/download-files.js");

//******Admin Jobs Routes */
const PostJob = require("./Admin/jobs/post-job.js");
const UpdateJob = require("./Admin/jobs/update-job.js");
const DeleteAdminJob = require("./Admin/jobs/delete-job.js");
const ShowSingleJob = require("./Admin/jobs/fetch-single-job.js");
const PublishJob = require("./Admin/jobs/publish-job.js");

//******Roles */
const AddNewRole = require("./Admin/roles/add.js");
const FetchAllRoles = require("./Admin/roles/fetch.js");
const FetchSingleRole = require("./Admin/roles/fetch-single.js");
const UpdateRole = require("./Admin/roles/update.js");
const DeleteRole = require("./Admin/roles/delete.js");

//******Admin Users */
const GetAllAdmins = require("./Admin/Users/get-all-admins.js");

//******Admin Applications */
const FetchAllApplications = require("./Admin/applications/fetch.js");
const DeclineApplication = require("./Admin/applications/decline.js");
const AcceptApplication = require("./Admin/applications/accept.js");
const SetInterview = require("./Admin/applications/setInterview.js");

//******Admin Time Sheet Managers */
const ApproveTSM = require("./Admin/tms/approve.js");
const RejectTSM = require("./Admin/tms/reject.js");
const UpdateTSM = require("./Admin/tms/update.js");
const GetAllTms = require("./Admin/tms/get-all-tms.js");

//******Admin Bookings */
const CreateBooking = require("./Admin/book/create.js");
const FetchAllBookings = require("./Admin/book/fetch.js");
const DeleteBooking = require("./Admin/book/delete.js");

//******Reporting */
const FetchReport = require("./Admin/Users/fetch-report.js");
const StorePayslip = require("./Admin/Users/store-payslip.js");

const user = new Map([
    ['/create-profile',CreateProfile],
    ['/update-profile',UpdateProfile],
    ['/get-user-details',GetDetails],
    ['/edit-profile',EditDetails],
    ['/change-password',ChangePassword],
    ['/delete-user',DeleteUser],
    ['/update-email',UpdateEmail],
    ['/get-roles', FetchRoles],

    //********Experience */
    ['/add-exp',AddExp],
    ['/edit-exp',EditExp],
    ['/delete-exp',DelExp],
    ['/fetch-exp', FetchExp],

    //*******Availability */
    ['/add-avail',AddAvail],
    ['/fetch-avail', FetchAvail],
    ['/sessions', JobDaySession],
    ['/fetch-day-session', FetchDaySession],

    //*******Jobs */
    ['/add-job', AddJob],
    ['/edit-job', EditJob],
    ['/delete-job', DeleteJob],
    ['/fetch-job', FetchJob],
    ['/fetch-jobs', FetchJobs],
    ['/day-sessions', DaySessionsJobs],
    ['/get-payslip', Payslip],
    ['/get-job-days', GetJobDays],

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
    ['/fetch-applied-jobs', FetchAppliedJobsForCandidate],

    //*************Candidate Bookings */
    ['/bookings', FetchCandidateBookings],
    ['/book', CandidateBookings],
    
    //*****Admin Routes */
    ['/get-all-candidate', GetAllCandidates],
    ['/get-all-client', GetAllClients],
    ['/get-all-permanent-jobs', GetAllPermanentJobs],
    ['/get-all-temporary-jobs', GetAllTemporaryJobs],
    ['/get-report', GetReport],
    ['/download-report', DownloadReport],

    //******Admin Client/Candidate Routes */
    ['/add-new-client', AddNewClient],
    ['/fetch-single-client', FetchSingleClient],
    ['/update-new-client', UpdateNewClient],
    ['/achieve-client', DeleteClient],
    ['/un-achieve-client', BringBackClient],
    ['/fetch-single-candidate', FetchSingleCandidate],
    ['/verify-candidate', VerifyCandidate],
    ['/upload-ref', UploadCandidateDoc],
    ['/upload-other', UploadCandidateDoc_other],
    ['/download-files', DownloadFiles],

    //******Admin Jobs Routes */
    ['/get-all-posted_jobs', GetAllJobs],
    ['/post-job', PostJob],
    ['/update-job', UpdateJob],
    ['/delete-job', DeleteAdminJob],
    ['/show-job', ShowSingleJob],
    ['/update-job-status', PublishJob],

    //******Roles */
    ['/add-role', AddNewRole],
    ['/fetch-roles', FetchAllRoles],
    ['/single-role', FetchSingleRole],
    ['/update-role', UpdateRole],
    ['/delete-role', DeleteRole],
    //******Roles */

    //******Admin Users */
    ['/get-all-admins', GetAllAdmins],
    
    //******Admin Applications */
    ['/get-all', FetchAllApplications],
    ['/decline', DeclineApplication],
    ['/accept', AcceptApplication],
    ['/set-interview', SetInterview],
    
    //******Admin Time Sheet Managers */
    ['/approve-tsm', ApproveTSM],
    ['/reject-tsm', RejectTSM],
    ['/update-tsm', UpdateTSM],
    ['/get-all-tms', GetAllTms],

    //******Admin Bookings */
    ['/create-booking', CreateBooking],
    ['/get-all-bookings', FetchAllBookings],
    ['/delete-booking', DeleteBooking],
    
    ['/fetch-report', FetchReport],
    ['/store-payslip', StorePayslip],

]);

module.exports = user;