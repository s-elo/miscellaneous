import Router from '@koa/router';

const router = new Router();

router.get('/get-user', (ctx) => {
  ctx.body = 'Hello World';
});

export default router;
