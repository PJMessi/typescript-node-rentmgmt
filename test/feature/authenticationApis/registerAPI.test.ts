import supertest from 'supertest';
import app from '@root/app';
import { User } from '@root/database/models';
import { assert } from 'chai';
import bcrypt from 'bcrypt';

const request = supertest(app);

const largeTestString =
  'k2ruaid6EU5NjX3nxWNn9gTQoBiPmrxkXQ9fqpkFp4tg5AyQGVbXzo8Rdw3hqcCwgbJG4LXhgu7ubCkCR1Mc7S0lBV10fP0wBmRroYefLZwIg7a1qerJRmYECrBCJ1esBtHup4UBAZcsnIHdrVMtczLwZIToCjXaIgNYNVU7ckxbAGDTA1vGgHtJturEbYd5XEYaoHR8i11yn2AZobXuCO7VnMcCb5JUkkPaOFYNNfu9JsWy1HxNCWujHfH9IFi6a2x1';

describe('POST /auth/register', () => {
  describe('Success case', () => {
    it('should create new user with the provided data.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const userData = {
        email: 'testuser@rentmag.com',
        password: 'password',
        name: 'Test User',
        passwordConfirmation: 'password',
      };
      const apiResult = await request.post('/auth/register').send(userData);
      assert.equal(apiResult.status, 200);

      /** checking the results------------------------------------------------------------------------ */
      const user = await User.findOne({ where: { email: userData.email } });
      assert.isNotNull(user);
      assert.include(
        {
          email: user?.email,
          name: user?.name,
        },
        {
          email: userData.email,
          name: userData.name,
        },
        'Name and email of the user should be same as that provided in the API.'
      );

      const passwordMatches = await bcrypt.compare(
        userData.password,
        user?.password!
      );
      assert.equal(
        passwordMatches,
        true,
        'Password of the user should be same as that provided in the API.'
      );
    });

    it('should return 200 status code with the created user and valid auth token.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const userData = {
        email: 'testuser@rentmag.com',
        password: 'password',
        name: 'Test User',
        passwordConfirmation: 'password',
      };
      const apiResult = await request.post('/auth/register').send(userData);
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

      assert.exists(
        apiResult.body.data.token,
        'API should return the auth token for the user.'
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
    it('should return 422 status code with error details if invalid email is provided.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const userData1 = {
        email: '',
        password: 'password',
        name: 'Test User',
        passwordConfirmation: 'password',
      };
      const apiResult1 = await request.post('/auth/register').send(userData1);
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
      const userData2 = {
        email: 'invalidemail',
        password: 'password',
        name: 'Test User',
        passwordConfirmation: 'password',
      };
      const apiResult2 = await request.post('/auth/register').send(userData2);
      assert.equal(
        apiResult2.status,
        422,
        'API should return 422 if invalid email is provided.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult2.body.errors.details[0],
        {
          path: ['email'],
        },
        'API should return the error details for email if invalid email is provided.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const userData3 = {
        password: 'password',
        name: 'Test User',
        passwordConfirmation: 'password',
      };
      const apiResult3 = await request.post('/auth/register').send(userData3);
      assert.equal(
        apiResult3.status,
        422,
        'API should return 422 if email is not provided.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult3.body.errors.details[0],
        {
          path: ['email'],
        },
        'API should return the error details for email if email is not provided.'
      );
    });

    it('should return 422 status code with error details if invalid name is provided.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const userData1 = {
        email: 'testuser@rentmag.com',
        password: 'password',
        name: '',
        passwordConfirmation: 'password',
      };
      const apiResult1 = await request.post('/auth/register').send(userData1);
      assert.equal(
        apiResult1.status,
        422,
        'API should return 422 if empty string is provided in name.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult1.body.errors.details[0],
        {
          path: ['name'],
        },
        'API should return the error details for name if empty string is provided in name.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const userData2 = {
        email: 'testuser@rentmag.com',
        password: 'password',
        passwordConfirmation: 'password',
      };
      const apiResult2 = await request.post('/auth/register').send(userData2);
      assert.equal(
        apiResult2.status,
        422,
        'API should return 422 if name is not provided.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult2.body.errors.details[0],
        {
          path: ['name'],
        },
        'API should return the error details for name if name is not provided.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const userData3 = {
        email: 'testuser@rentmag.com',
        password: 'password',
        name: largeTestString,
        passwordConfirmation: 'password',
      };
      const apiResult3 = await request.post('/auth/register').send(userData3);
      assert.equal(
        apiResult3.status,
        422,
        'API should return 422 if string greater than 255 characters is provided in name.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult3.body.errors.details[0],
        {
          path: ['name'],
        },
        'API should return the error details for name if string greater than 255 characters is provided in name.'
      );
    });

    it('should return 422 status code with error details if invalid password is provided.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const userData1 = {
        email: 'testuser@rentmag.com',
        name: 'Test User',
        password: '',
        passwordConfirmation: '',
      };
      const apiResult1 = await request.post('/auth/register').send(userData1);
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
      const userData2 = {
        name: 'Test User',
        email: 'testuser@rentmag.com',
        password: '12',
        passwordConfirmation: '12',
      };
      const apiResult2 = await request.post('/auth/register').send(userData2);
      assert.equal(
        apiResult2.status,
        422,
        'API should return 422 if string less than 5 characters is provided in password.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult2.body.errors.details[0],
        {
          path: ['password'],
        },
        'API should return the error details for password if string less than 5 characters is provided in password.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const userData3 = {
        email: 'testuser@rentmag.com',
        name: 'Test User',
        password: largeTestString,
        passwordConfirmation: largeTestString,
      };
      const apiResult3 = await request.post('/auth/register').send(userData3);
      assert.equal(
        apiResult3.status,
        422,
        'API should return 422 if string greater than 255 characters is provided in password.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult3.body.errors.details[0],
        {
          path: ['password'],
        },
        'API should return the error details for password if string greater than 255 characters is provided in password.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const userData4 = {
        email: 'testuser@rentmag.com',
        name: 'Test User',
        password: 'password',
        passwordConfirmation: 'anotherpassword',
      };
      const apiResult4 = await request.post('/auth/register').send(userData4);
      assert.equal(
        apiResult4.status,
        422,
        'API should return 422 if password confirmation does not match.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult4.body.errors.details[0],
        {
          path: ['passwordConfirmation'],
        },
        'API should return the error details for passwordConfirmation if password confirmation does not match.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const userData5 = {
        email: 'testuser@rentmag.com',
        name: 'Test User',
      };
      const apiResult5 = await request.post('/auth/register').send(userData5);
      assert.equal(
        apiResult5.status,
        422,
        'API should return 422 if password is not provided.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult5.body.errors.details[0],
        {
          path: ['password'],
        },
        'API should return the error details for password if password is not provided.'
      );
    });
  });
});
