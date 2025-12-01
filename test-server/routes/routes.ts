import { Router } from "express";
import { downloadFile, newDeployment, provideProjectFiles, provideProjectIndex, } from "../controller/controller.js";
import { testSubmit1, testSubmit2, testSubmit3 } from "../controller/testFunctions.js";
import { validateObjectId } from "../middleware/validate.js";
import multer from "multer"

const upload = multer({ dest: 'public/temp/' });
const router = Router({})

router.get(
	'/downloads/:projectId/:deploymentId',
	validateObjectId('projectId'),
	validateObjectId('deploymentId'),
	downloadFile
);
router.use(
	'/projects/:projectId/:deploymentId',
	validateObjectId('projectId'),
	validateObjectId('deploymentId'),
	provideProjectFiles
);

router.use(
	'/projects/:projectId/:deploymentId',
	validateObjectId('projectId'),
	validateObjectId('deploymentId'),
	provideProjectIndex
);


router.post(
	"/new/:projectId/:deploymentId",
	upload.single("file"),
	validateObjectId('projectId'),
	validateObjectId('deploymentId'),
	newDeployment
);

router.post('/submit', testSubmit1)
router.post('/submit2', testSubmit2);
router.post('/submit3', testSubmit3)


export default router