import { Router } from "express";
import { downloadFile, provideProjectFiles, provideProjectIndex, } from "../controller/controller";
import { testSubmit1, testSubmit2, testSubmit3 } from "../controller/testFunctions";
import { validateObjectId } from "../middleware/validate";


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




router.post('/submit', testSubmit1)
router.post('/submit2', testSubmit2);
router.post('/submit3', testSubmit3)


export default router