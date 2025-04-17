const Joi = require("joi");

// Middleware wrapper
const validate = (schema) => (req, res, next) => {
  const data = req.method === "GET" ? req.params : req.body;
  const { error } = schema.validate(data);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

// Token
exports.accessTokenValidator = validate(
  Joi.object({
    clientId: Joi.string().required(),
    clientSecret: Joi.string().required(),
  })
);

// Students
exports.registerUserValidator = validate(
  Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  })
);

exports.confirmUserValidator = validate(
  Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().length(6).required(),
  })
);

exports.loginUserValidator = validate(
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
);

exports.googleLoginValidator = validate(
  Joi.object({
    email: Joi.string().email().required(),
  })
);

exports.googleSetupValidator = validate(
  Joi.object({
    tokenId: Joi.string().required(),
  })
);

exports.resendCodeValidator = validate(
  Joi.object({
    email: Joi.string().email().required(),
  })
);

exports.checkUserValidator = validate(
  Joi.object({
    email: Joi.string().email().required(),
  })
);

exports.forgotPasswordValidator = validate(
  Joi.object({
    email: Joi.string().email().required(),
  })
);

exports.resetPasswordValidator = validate(
  Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().required(),
    password: Joi.string().min(6).required(),
  })
);

// Teachers
exports.teacherLoginValidator = validate(
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
);

exports.editTeacherProfileValidator = validate(
  Joi.object({
    name: Joi.string(),
    bio: Joi.string(),
    degree: Joi.string(),
    experience: Joi.string(),
    city: Joi.string(),
  })
);

exports.getCitiesValidator = validate(
  Joi.object({
    country: Joi.string().required(),
  })
);

// General
exports.idValidator = validate(
  Joi.object({
    id: Joi.number().required(),
  })
);

exports.paginationValidator = validate(
  Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
  })
);

// Assignments
exports.studentAssignmentSubmissionValidator = validate(
  Joi.object({
    assignmentId: Joi.number().required(),
    ayah: Joi.string().optional(),
  })
);

exports.studentAssignmentResubmissionValidator = validate(
  Joi.object({
    assignmentId: Joi.number().required(),
  })
);

exports.assignmentFeedbackValidator = validate(
  Joi.object({
    assignmentId: Joi.number().required(),
    feedback: Joi.string().required(),
  })
);

exports.getAssignmentsValidator = validate(Joi.object({}));

// Khatmah Teams
exports.createKhatmahTeamValidator = validate(
  Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
    dailyTarget: Joi.number().required(),
  })
);

exports.khatmahTeamCodeValidator = validate(
  Joi.object({
    code: Joi.string().required(),
  })
);

exports.khatmahTeamCodeAndIdValidator = validate(
  Joi.object({
    code: Joi.string().required(),
    id: Joi.number().required(),
  })
);

exports.updateDailyTargetValidator = validate(
  Joi.object({
    dailyTarget: Joi.number().required(),
  })
);

// FCM
exports.fcmToken = validate(
  Joi.object({
    token: Joi.string().required(),
  })
);
