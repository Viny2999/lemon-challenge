import { Router } from 'express';
import { HealthCheckController } from './health-check.controller';
import { EligibilityController } from './eligibility.controller';

const router = Router();

const defaultRoutes = [
  {
    path: '/health',
    route: HealthCheckController,
  },
  {
    path: '/eligibility',
    route: EligibilityController,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export const Routes: Router = router;
