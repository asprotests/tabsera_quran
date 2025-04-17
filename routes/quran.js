const express = require("express");
const upload = require("multer")();
const router = express.Router();

const userTypes = require("../consts/userTypes");
const validators = require("../validation/quran");
const middleware = require("../middlewares/auth");

const TokenApi = require("../controllers/token");
const UserApi = require("../controllers/user");
const CoursesApi = require("../controllers/course");
const AssignmentsApi = require("../controllers/assignment");
const EnrollmentsApi = require("../controllers/enrollment");
const KhatmahTeamsApi = require("../controllers/khatmahTeams");
const DeviceTokensApi = require("../controllers/firebase");

// Token route
router.post(
  "/tokens/access-token",
  validators.accessTokenValidator,
  TokenApi.getTabseraAccessToken
);

// Auth middleware for next routes
router.use(middleware.AuthenticateQuranClientMiddleware);

// Student auth routes
router.post(
  "/users/students/register",
  validators.registerUserValidator,
  UserApi.createTabseraQuranUser
);
router.post(
  "/users/students/verify",
  validators.confirmUserValidator,
  UserApi.confirmTabseraQuranUser
);
router.post(
  "/users/students/login",
  validators.loginUserValidator,
  UserApi.loginTabseraQuran
);
router.post(
  "/users/students/google/login",
  validators.googleLoginValidator,
  UserApi.googleLoginTabseraQuran
);
router.post(
  "/users/students/resend-code",
  validators.resendCodeValidator,
  UserApi.resendCodeForTabseraQuran
);
router.get(
  "/users/students/check/:email",
  validators.checkUserValidator,
  UserApi.checkUserForTabseraQuran
);
router.post(
  "/users/students/forgot-password",
  validators.forgotPasswordValidator,
  UserApi.forgotPasswordForTabseraQuran
);
router.post(
  "/users/students/reset-password",
  validators.resetPasswordValidator,
  UserApi.resetPasswordForTabseraQuran
);

// Teacher login
router.post(
  "/users/teachers/login",
  validators.teacherLoginValidator,
  UserApi.teacherLoginForTabseraQuran
);

// Auth middleware for logged-in users
router.use(middleware.AuthenticateForQuranMiddleware);

// Teacher profile routes
router.get(
  "/users/teachers/profile",
  middleware.UserRolesForQuranMiddleware([userTypes.teacher]),
  UserApi.getProfileForTabseraQuran
);
router.get(
  "/users/teachers/profile/meta",
  middleware.UserRolesForQuranMiddleware([userTypes.teacher]),
  UserApi.getProfileMetaForTabseraQuran
);
router.get(
  "/users/teachers/profile/meta/cities/:country",
  middleware.UserRolesForQuranMiddleware([userTypes.teacher]),
  validators.getCitiesValidator,
  UserApi.getCitiesForTabseraQuran
);
router.put(
  "/users/teachers/profile",
  middleware.UserRolesForQuranMiddleware([userTypes.teacher]),
  upload.any(),
  validators.editTeacherProfileValidator,
  UserApi.editProfileForTabseraQuran
);

// Shared routes
router.delete(
  "/users/profile",
  middleware.UserRolesForQuranMiddleware([
    userTypes.student,
    userTypes.teacher,
  ]),
  UserApi.deleteTabseraQuranUser
);
router.post(
  "/users/students/google/setup",
  middleware.UserRolesForQuranMiddleware([userTypes.student]),
  validators.googleSetupValidator,
  UserApi.googleSetup
);

// Course routes
router.put(
  "/courses/complete/:id",
  middleware.UserRolesForQuranMiddleware([userTypes.student]),
  validators.idValidator,
  EnrollmentsApi.terminateEnrollment
);
router.get(
  "/courses/student-completed-courses",
  middleware.UserRolesForQuranMiddleware([
    userTypes.principal,
    userTypes.teacher,
    userTypes.student,
  ]),
  validators.studentCoursesValidator,
  CoursesApi.getCoursesCompletedByStudentOfTabseraQuran
);
router.post(
  "/courses/enrollment/:id",
  middleware.UserRolesForQuranMiddleware([userTypes.student]),
  validators.idValidator,
  EnrollmentsApi.enrollToTabseraQuranCourse
);
router.put(
  "/courses/revoke/:id",
  validators.idValidator,
  EnrollmentsApi.revokeTabseraQuranEnrollment
);
router.get(
  "/courses/student",
  validators.paginationValidator,
  CoursesApi.getTabseraQuranStudentCourses
);
router.get(
  "/courses",
  middleware.UserRolesForQuranMiddleware([
    userTypes.student,
    userTypes.teacher,
    userTypes.principal,
  ]),
  CoursesApi.getTabseraQuranCourses
);

// Assignment routes
router
  .route("/assignments/submission")
  .post(
    middleware.UserRolesForQuranMiddleware([
      userTypes.student,
      userTypes.child,
    ]),
    upload.array("files"),
    validators.studentAssignmentSubmissionValidator,
    AssignmentsApi.addStudentAssignmentSubmissionForTabseraQuran
  )
  .put(
    middleware.UserRolesForQuranMiddleware([
      userTypes.student,
      userTypes.child,
    ]),
    upload.array("files"),
    validators.studentAssignmentResubmissionValidator,
    AssignmentsApi.resubmitAssignmentForTabseraQuran
  );

router.put(
  "/assignments/lock/:id",
  middleware.UserRolesForQuranMiddleware([userTypes.teacher]),
  validators.idValidator,
  AssignmentsApi.lockAssignmentForTabseraQuran
);
router.put(
  "/assignments/unlock/:id",
  middleware.UserRolesForQuranMiddleware([userTypes.teacher]),
  validators.idValidator,
  AssignmentsApi.unlockAssignmentForTabseraQuran
);
router.post(
  "/assignments/submission-feedback",
  middleware.UserRolesForQuranMiddleware([userTypes.teacher]),
  upload.array("files"),
  validators.assignmentFeedbackValidator,
  AssignmentsApi.giveFeedbackOnTabseraQuranAssignmentSubmission
);
router.get(
  "/assignments/last-ending-ayah",
  middleware.UserRolesForQuranMiddleware([userTypes.student, userTypes.child]),
  AssignmentsApi.getLastAssignmentEndingAyahForTabseraQuran
);
router.get(
  "/assignments",
  middleware.UserRolesForQuranMiddleware([
    userTypes.teacher,
    userTypes.student,
  ]),
  validators.getAssignmentsValidator,
  AssignmentsApi.getAssignmentsByUserIdForTabseraQuran
);

// Khatmah Teams
router.post(
  "/khatmah/teams",
  middleware.UserRolesForQuranMiddleware([
    userTypes.teacher,
    userTypes.student,
  ]),
  validators.createKhatmahTeamValidator,
  KhatmahTeamsApi.createKhatmahTeam
);
router.get(
  "/khatmah/teams",
  middleware.UserRolesForQuranMiddleware([
    userTypes.teacher,
    userTypes.student,
  ]),
  KhatmahTeamsApi.getAllMyKhatmahTeams
);
router.get(
  "/khatmah/teams/code/:code",
  middleware.UserRolesForQuranMiddleware([
    userTypes.teacher,
    userTypes.student,
  ]),
  validators.khatmahTeamCodeValidator,
  KhatmahTeamsApi.getKhatmahTeamByCode
);
router
  .route("/khatmah/teams/:id")
  .get(
    middleware.UserRolesForQuranMiddleware([
      userTypes.teacher,
      userTypes.student,
    ]),
    validators.idValidator,
    KhatmahTeamsApi.getKhatmahTeamById
  )
  .patch(
    middleware.UserRolesForQuranMiddleware([
      userTypes.teacher,
      userTypes.student,
    ]),
    validators.idValidator,
    validators.updateDailyTargetValidator,
    KhatmahTeamsApi.updateDailyTarget
  )
  .delete(
    middleware.UserRolesForQuranMiddleware([
      userTypes.teacher,
      userTypes.student,
    ]),
    validators.idValidator,
    KhatmahTeamsApi.deleteKhatmahTeam
  );

router.post(
  "/khatmah/teams/:code/remove/:id",
  middleware.UserRolesForQuranMiddleware([
    userTypes.teacher,
    userTypes.student,
  ]),
  validators.khatmahTeamCodeAndIdValidator,
  KhatmahTeamsApi.removeTeamMember
);
router.post(
  "/khatmah/teams/:code/join",
  middleware.UserRolesForQuranMiddleware([
    userTypes.teacher,
    userTypes.student,
  ]),
  validators.khatmahTeamCodeValidator,
  KhatmahTeamsApi.joinKhatmahTeam
);
router.post(
  "/khatmah/teams/:code/leave",
  middleware.UserRolesForQuranMiddleware([
    userTypes.teacher,
    userTypes.student,
  ]),
  validators.khatmahTeamCodeValidator,
  KhatmahTeamsApi.leaveKhatmahTeam
);
router.post(
  "/khatmah/teams/:code/session",
  middleware.UserRolesForQuranMiddleware([
    userTypes.teacher,
    userTypes.student,
  ]),
  validators.khatmahTeamCodeValidator,
  validators.udpateKhatmahMemberProgress,
  KhatmahTeamsApi.updateMemberProgress
);

// FCM Token
router.post(
  "/fcm-token",
  middleware.UserRolesForQuranMiddleware([userTypes.student]),
  validators.fcmToken,
  DeviceTokensApi.saveDeviceToken
);

module.exports = router;
