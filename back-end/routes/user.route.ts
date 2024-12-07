import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import UserRepository from "../repository/user.repository";
import jobRepository from "../repository/job.repository";
import { JobController } from "../controllers/job.controller";
import { JobService } from "../services/job.service";
import companyRepository from "../repository/company.repository";
import { OtpService } from "../services/otp.service";
import otpRepository from "../repository/otp.repository";
import { ProfessionalDetailsController } from "../controllers/professionalDetails.controller";
import { ProfessionalDetailsService } from "../services/professionalDetails.service";
import professionalDetailsRepository from "../repository/professionalDetails.repository";
import { authenticateToken } from "../middlewares/authmiddleware";
import { authorizeRole } from "../middlewares/authorizeRole";

const userService = new UserService(UserRepository);
const otpService= new OtpService(otpRepository);
const jobService=new JobService(jobRepository,companyRepository);
const professionalDetailsService = new ProfessionalDetailsService(professionalDetailsRepository);
const userController = new UserController(userService,otpService);
const jobController=new JobController(jobService);
const professionalDetailsController=new ProfessionalDetailsController(professionalDetailsService);
  
const userRouter = Router();


userRouter.post('/register',authenticateToken,authorizeRole('user'), userController.createUser.bind(userController));
userRouter.post('/login', userController.login.bind(userController));
userRouter.post('/verify-otp',userController.verifyOtp.bind(userController));
userRouter.get('/jobs',jobController.getAllJobs.bind(jobController));
userRouter.get('/job/:id',authorizeRole('user'),jobController.getJobById.bind(jobController));
userRouter.post('/job/:jobId/apply',authenticateToken,authorizeRole('user'), jobController.applyForJob.bind(jobController));
userRouter.get('/applied/:userId',authenticateToken,authorizeRole('user'), jobController.appliedJobs.bind(jobController));
userRouter.get('/shortListed/:userId',authenticateToken,authorizeRole('user'), jobController.shortListedJobs.bind(jobController));
userRouter.post('/refresh-token',userController.refreshToken.bind(userController));
userRouter.put('/professional-details/:id',authenticateToken,authorizeRole('user'),  professionalDetailsController.update.bind(professionalDetailsController));
userRouter.get('/professional-details/:id',authenticateToken,authorizeRole('user'), professionalDetailsController.getByUserId.bind(professionalDetailsController));
userRouter.post('/professional-details',authenticateToken,authorizeRole('user'),  professionalDetailsController.create.bind(professionalDetailsController));


export default userRouter;
