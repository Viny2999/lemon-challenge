import { EligibilityService } from '../../services';
import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { eligibilityBody } from '../../validations';

const router = Router();
const eligibilityService = new EligibilityService();

router.post('/', validate(eligibilityBody), eligibilityService.checkEligibility);

export const EligibilityController: Router = router;
