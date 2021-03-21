import supertest from 'supertest';
import app from '@root/app';
import { User } from '@root/database/models';
import { assert } from 'chai';

const request = supertest(app);

describe('GET /auth/profile', () => {
  describe('Success case', () => {
    it('should return 200 status code with the user.', async () => {
      /** creating test dependencies------------------------------------------------------------------ */
      const userData = {
        email: 'testuser@rentmag.com',
        password: 'password',
        name: 'Test User',
        passwordConfirmation: 'password',
      };
      await request.post('/auth/register').send(userData);

      const credentials = {
        email: userData.email,
        password: userData.password,
      };
      const depApiResult = await request.post('/auth/login').send(credentials);
      const token = depApiResult.body.data.token!;

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult = await request
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`);
      assert.equal(apiResult.status, 200);

      /** checking the results------------------------------------------------------------------------ */
      const user = await User.findOne({ where: { email: userData.email } });
      const userInApiResult = apiResult.body.data.user;
      assert.include(
        userInApiResult,
        {
          id: user?.id,
          email: user?.email,
          name: user?.name,
          createdAt: user?.createdAt.toISOString(),
          updatedAt: user?.updatedAt.toISOString(),
        },
        'API should return correct user information.'
      );
    });
  });

  describe('Error case', () => {
    it('should return 401 status code if bearer token is invalid.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const apiResult1 = await request.get('/auth/profile');
      assert.equal(
        apiResult1.status,
        401,
        'API should return 401 response code if the bearer token is not provided.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult2 = await request
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalidtoken');
      assert.equal(
        apiResult2.status,
        401,
        'API should return 401 response code if invalid bearer token is provided.'
      );
    });
  });
});
