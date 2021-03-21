import supertest from 'supertest';
import app from '@root/app';
import { User } from '@root/database/models';
import { assert } from 'chai';

const request = supertest(app);

describe('POST /auth/login', () => {
  describe('Success case', () => {
    it('should return 200 status code with the user and valid auth token.', async () => {
      /** creating test dependencies------------------------------------------------------------------ */
      // calling API to register new user.
      const userData = {
        email: 'testuser@rentmag.com',
        password: 'password',
        name: 'Test User',
        passwordConfirmation: 'password',
      };
      await request.post('/auth/register').send(userData);
      const user = await User.findOne({ where: { email: userData.email } });

      /** calling the test api------------------------------------------------------------------------ */
      const credentials = {
        email: userData.email,
        password: userData.password,
      };
      const apiResult = await request.post('/auth/login').send(credentials);
      assert.equal(
        apiResult.status,
        200,
        'API should return 200 status code on success case.'
      );

      /** checking the results------------------------------------------------------------------------ */
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

      const tokenInApiResult = apiResult.body.data.token;
      assert.exists(
        tokenInApiResult,
        'API should return the auth token for the user.'
      );

      const testApiResult = await request
        .get('/auth/profile')
        .set('Authorization', `Bearer ${tokenInApiResult}`);
      assert.equal(
        testApiResult.status,
        200,
        'Token received from the API should be valid.'
      );
    });
  });

  describe('Error case', () => {
    it('should return 401 status code if the provided credentials is invalid.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const credentials = {
        email: 'testuser@rentmag.com',
        password: 'password',
      };
      const apiResult = await request.post('/auth/login').send(credentials);
      assert.equal(apiResult.status, 401);
    });

    it('should return 422 status code with error details if email is not provided.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const credentials1 = {
        email: '',
        password: 'password',
      };
      const apiResult1 = await request.post('/auth/login').send(credentials1);
      assert.equal(
        apiResult1.status,
        422,
        'API should return 422 if empty string is provided in email.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult1.body.errors.details[0],
        {
          path: ['email'],
        },
        'API should return the error details for email if empty string is provided in email.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const credentials2 = {
        password: 'password',
      };
      const apiResult2 = await request.post('/auth/login').send(credentials2);
      assert.equal(
        apiResult2.status,
        422,
        'API should return 422 if email is not provided.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult2.body.errors.details[0],
        {
          path: ['email'],
        },
        'API should return the error details for email if email is not provided.'
      );
    });

    it('should return 422 status code with error details if password is not provided.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const credentials1 = {
        email: 'testuser@rentmag.com',
        password: '',
      };
      const apiResult1 = await request.post('/auth/login').send(credentials1);
      assert.equal(
        apiResult1.status,
        422,
        'API should return 422 if empty string is provided in password.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult1.body.errors.details[0],
        {
          path: ['password'],
        },
        'API should return the error details for password if empty string is provided in password.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const credentials2 = {
        email: 'testuser@rentmag.com',
      };
      const apiResult2 = await request.post('/auth/login').send(credentials2);
      assert.equal(
        apiResult2.status,
        422,
        'API should return 422 if password is not provided.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult2.body.errors.details[0],
        {
          path: ['password'],
        },
        'API should return the error details for password if password is not provided.'
      );
    });
  });
});
