import supertest from 'supertest';
import app from '@root/app';
import { Room } from '@root/database/models';
import { assert } from 'chai';

const request = supertest(app);

const largeTestString =
  'k2ruaid6EU5NjX3nxWNn9gTQoBiPmrxkXQ9fqpkFp4tg5AyQGVbXzo8Rdw3hqcCwgbJG4LXhgu7ubCkCR1Mc7S0lBV10fP0wBmRroYefLZwIg7a1qerJRmYECrBCJ1esBtHup4UBAZcsnIHdrVMtczLwZIToCjXaIgNYNVU7ckxbAGDTA1vGgHtJturEbYd5XEYaoHR8i11yn2AZobXuCO7VnMcCb5JUkkPaOFYNNfu9JsWy1HxNCWujHfH9IFi6a2x1';

describe('POST /rooms', () => {
  describe('Success case', () => {
    it('should create new room with the provided data and "EMPTY" status.', async () => {
      /** creating test dependencies------------------------------------------------------------------ */
      // calling API to register new user.
      const userData = {
        email: 'testuser@rentmag.com',
        password: 'password',
        name: 'Test User',
        passwordConfirmation: 'password',
      };
      const depApiResult1 = await request.post('/auth/register').send(userData);
      const token = depApiResult1.body.data.token!;

      /** calling the test api------------------------------------------------------------------------ */
      const roomData = {
        name: 'Room 1',
        description: 'Description for Room 1',
        price: 5000,
      };
      const apiResult = await request
        .post('/rooms')
        .send(roomData)
        .set('Authorization', `Bearer ${token}`);
      assert.equal(
        apiResult.status,
        200,
        'API should return 200 status code on success case.'
      );

      /** checking the results------------------------------------------------------------------------ */
      const room = await Room.findOne({ where: { name: roomData.name } });
      assert.isNotNull(room, 'Room should be created.');
      assert.equal(
        room?.status,
        'EMPTY',
        'Room should have "EMPTY" status when created.'
      );
      assert.include(
        {
          name: room?.name,
          description: room?.description,
          price: room?.price,
        },
        roomData
      );
    });

    it('should return 200 status code and the created room.', async () => {
      /** creating test dependencies------------------------------------------------------------------ */
      // calling API to register new user.
      const userData = {
        email: 'testuser@rentmag.com',
        password: 'password',
        name: 'Test User',
        passwordConfirmation: 'password',
      };
      const depApiResult1 = await request.post('/auth/register').send(userData);
      const token = depApiResult1.body.data.token!;

      /** calling the test api------------------------------------------------------------------------ */
      const roomData = {
        name: 'Room 1',
        description: 'Description for Room 1',
        price: 5000,
      };
      const apiResult = await request
        .post('/rooms')
        .send(roomData)
        .set('Authorization', `Bearer ${token}`);
      assert.equal(
        apiResult.status,
        200,
        'API should return 200 status code on success case.'
      );

      /** checking the results------------------------------------------------------------------------ */
      const room = await Room.findOne({ where: { name: roomData.name } });
      const roomInApiResult = apiResult.body.data.room;
      assert.include(
        roomInApiResult,
        {
          id: room?.id,
          name: room?.name,
          description: room?.description,
          status: room?.status,
          createdAt: room?.createdAt.toISOString(),
          updatedAt: room?.updatedAt.toISOString(),
        },
        'API should return correct room information.'
      );
    });
  });

  describe('Error case', () => {
    it('should return 401 status code if bearer token is invalid.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const apiResult1 = await request.post('/rooms');
      assert.equal(
        apiResult1.status,
        401,
        'API should return 401 response code if the bearer token is not provided.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult2 = await request
        .post('/rooms')
        .set('Authorization', 'Bearer invalidtoken');
      assert.equal(
        apiResult2.status,
        401,
        'API should return 401 response code if invalid bearer token is provided.'
      );
    });

    it('should return 422 status code with error details if invalid name is provided.', async () => {
      /** creating test dependencies------------------------------------------------------------------ */
      // calling API to register new user.
      const userData = {
        email: 'testuser@rentmag.com',
        password: 'password',
        name: 'Test User',
        passwordConfirmation: 'password',
      };
      const depApiResult1 = await request.post('/auth/register').send(userData);
      const token = depApiResult1.body.data.token!;

      /** calling the test api------------------------------------------------------------------------ */
      const roomData1 = {
        name: '',
        description: 'Description for Room 1',
        price: 5000,
      };
      const apiResult1 = await request
        .post('/rooms')
        .send(roomData1)
        .set('Authorization', `Bearer ${token}`);
      assert.equal(
        apiResult1.status,
        422,
        'API should return 422 status code if empty string is provided in name.'
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
      const roomData2 = {
        description: 'Description for Room 1',
        price: 5000,
      };
      const apiResult2 = await request
        .post('/rooms')
        .send(roomData2)
        .set('Authorization', `Bearer ${token}`);
      assert.equal(
        apiResult2.status,
        422,
        'API should return 422 status code if name is not provided.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult2.body.errors.details[0],
        {
          path: ['name'],
        },
        'API should return the error details for email if name is not provided.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const roomData3 = {
        name: largeTestString,
        description: 'Description for Room 1',
        price: 5000,
      };
      const apiResult3 = await request
        .post('/rooms')
        .send(roomData3)
        .set('Authorization', `Bearer ${token}`);
      assert.equal(
        apiResult3.status,
        422,
        'API should return 422 status code if string greater than 255 characters is provided in name.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult3.body.errors.details[0],
        {
          path: ['name'],
        },
        'API should return the error details for email if string greater than 255 characters is provided in name.'
      );
    });

    it('should return 422 status code with error details if invalid description is provided.', async () => {
      /** creating test dependencies------------------------------------------------------------------ */
      // calling API to register new user.
      const userData = {
        email: 'testuser@rentmag.com',
        password: 'password',
        name: 'Test User',
        passwordConfirmation: 'password',
      };
      const depApiResult1 = await request.post('/auth/register').send(userData);
      const token = depApiResult1.body.data.token!;

      /** calling the test api------------------------------------------------------------------------ */
      const roomData1 = {
        name: 'Room 1',
        description: largeTestString,
        price: 5000,
      };
      const apiResult1 = await request
        .post('/rooms')
        .send(roomData1)
        .set('Authorization', `Bearer ${token}`);
      assert.equal(
        apiResult1.status,
        422,
        'API should return 422 status code if string greater than 255 characters is provided in description.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult1.body.errors.details[0],
        {
          path: ['description'],
        },
        'API should return the error details for description if string greater than 255 characters is provided in description.'
      );
    });

    it('should return 422 status code with error details if invalid price is provided.', async () => {
      /** creating test dependencies------------------------------------------------------------------ */
      // calling API to register new user.
      const userData = {
        email: 'testuser@rentmag.com',
        password: 'password',
        name: 'Test User',
        passwordConfirmation: 'password',
      };
      const depApiResult1 = await request.post('/auth/register').send(userData);
      const token = depApiResult1.body.data.token!;

      /** calling the test api------------------------------------------------------------------------ */
      const roomData1 = {
        name: 'Room 1',
        description: 'Description for Room 1',
        price: '',
      };
      const apiResult1 = await request
        .post('/rooms')
        .send(roomData1)
        .set('Authorization', `Bearer ${token}`);
      assert.equal(
        apiResult1.status,
        422,
        'API should return 422 status code if empty string is provided in price.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult1.body.errors.details[0],
        {
          path: ['price'],
        },
        'API should return the error details for price if empty string is provided in price.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const roomData2 = {
        name: 'Room 1',
        description: 'Description for Room 1',
      };
      const apiResult2 = await request
        .post('/rooms')
        .send(roomData2)
        .set('Authorization', `Bearer ${token}`);
      assert.equal(
        apiResult2.status,
        422,
        'API should return 422 status code if price is not provided.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult2.body.errors.details[0],
        {
          path: ['price'],
        },
        'API should return the error details for price if price is not provided.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const roomData3 = {
        name: 'Room 1',
        description: 'Description for Room 1',
        price: 9999999,
      };
      const apiResult3 = await request
        .post('/rooms')
        .send(roomData3)
        .set('Authorization', `Bearer ${token}`);
      assert.equal(
        apiResult3.status,
        422,
        'API should return 422 status code if number greater than 999999.99 is provided in price.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult3.body.errors.details[0],
        {
          path: ['price'],
        },
        'API should return the error details for price if number greater than 999999.99 is provided in price.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const roomData4 = {
        name: 'Room 1',
        description: 'Description for Room 1',
        price: 'asd',
      };
      const apiResult4 = await request
        .post('/rooms')
        .send(roomData4)
        .set('Authorization', `Bearer ${token}`);
      assert.equal(
        apiResult4.status,
        422,
        'API should return 422 status code if string is provided in price.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult4.body.errors.details[0],
        {
          path: ['price'],
        },
        'API should return the error details for price if string is provided in price.'
      );
    });
  });
});
