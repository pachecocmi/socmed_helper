import { PageController } from './controllers/PageController.js';

const pageController = new PageController();
export const routesConfig = [
  {
    method: 'GET',
    path: '/dashboard',
    handler: pageController.dashboard.bind(pageController)
  },
  {
    method: 'GET',
    path: '/login',
    handler: pageController.login.bind(pageController)
  },
  {
    method: 'GET',
    path: '/user',
    handler: pageController.userAccount.bind(pageController)
  }
];