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
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(100).required(),
    country: Joi.string().required(),
    gender: Joi.string().valid("Male", "Female").required(),
    language: Joi.string().required(),
  })
);

exports.confirmUserValidator = validate(
  Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
  })
);

exports.loginUserValidator = validate(
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  })
);

exports.googleLoginValidator = validate(
  Joi.object({
    token: Joi.string().required(),
  })
);

exports.googleSetupValidator = validate(
  Joi.object({
    tokenId: Joi.string().required(),
    gender: Joi.string().valid("Male", "Female").required(),
    country: Joi.string().required(),
    language: Joi.string().required(),
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
    otp: Joi.string().length(6).required(),
    password: Joi.string().min(6).max(100).required(),
  })
);

exports.studentCoursesValidator = (req, res, next) => {
  const { value, error } = Joi.object({
    studentId:
      req.user?.role === userTypes.student
        ? Joi.forbidden()
        : Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
    sort: Joi.string().optional().default("_id"),
    sortDirection: Joi.number().integer().optional().default(1),
    page: Joi.number().integer().optional().default(0),
    limit: Joi.number().integer().optional().default(5),
  }).validate(req.query);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  req.query = value;
  next();
};

// Teachers
exports.teacherLoginValidator = validate(
  Joi.object({
    username: Joi.string().required(),
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
    type: Joi.string()
      .valid("active", "completed", "revoked")
      .default("active"),
    page: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).default(10),
    sort: Joi.string().default("name"),
    sortDirection: Joi.number().valid(1, -1).default(1),
  }),
  "query"
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

exports.udpateKhatmahMemberProgress = validate(
  Joi.object({
    progress: Joi.object({
      completed: Joi.boolean().optional(),
      currentAyah: Joi.string().optional(),
      notes: Joi.string().optional(),
    }).required(),
  })
);

// FCM
exports.fcmToken = validate(
  Joi.object({
    token: Joi.string().required(),
  })
);
