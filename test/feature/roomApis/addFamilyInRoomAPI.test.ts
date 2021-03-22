import supertest from 'supertest';
import app from '@root/app';
import { Room } from '@root/database/models';
import { assert } from 'chai';

const request = supertest(app);

const largeTestString =
  'k2ruaid6EU5NjX3nxWNn9gTQoBiPmrxkXQ9fqpkFp4tg5AyQGVbXzo8Rdw3hqcCwgbJG4LXhgu7ubCkCR1Mc7S0lBV10fP0wBmRroYefLZwIg7a1qerJRmYECrBCJ1esBtHup4UBAZcsnIHdrVMtczLwZIToCjXaIgNYNVU7ckxbAGDTA1vGgHtJturEbYd5XEYaoHR8i11yn2AZobXuCO7VnMcCb5JUkkPaOFYNNfu9JsWy1HxNCWujHfH9IFi6a2x1';

describe('POST /rooms/:roomId/families', () => {
  describe('Success case', () => {
    it('should create new family with members, add them to the room and update the room status to "OCCUPIED".', async () => {
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

      // calling API to create a room.
      const roomData = {
        name: 'Room 1',
        description: 'Description for Room 1',
        price: 5000,
      };
      await request
        .post('/rooms')
        .send(roomData)
        .set('Authorization', `Bearer ${token}`);
      const room = await Room.findOne({ where: { name: roomData.name } });

      /** calling the test api------------------------------------------------------------------------ */
      const familyData = {
        name: 'Family 1',
        sourceOfIncome: 'Software engineer job',
        membersList: [
          {
            name: 'Member 1',
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: '1998-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult.status,
        200,
        'API should return 200 status code on success case.'
      );

      /** checking the results------------------------------------------------------------------------ */
      await room?.reload();
      const family = await room?.getFamily({ include: ['members'] });
      const members = family?.members!;
      assert.isNotNull(family, 'Family should be created.');

      assert.include(
        {
          name: family?.name,
          sourceOfIncome: family?.sourceOfIncome,
        },
        {
          name: familyData.name,
          sourceOfIncome: familyData.sourceOfIncome,
        },
        'Name and source of income of the user should be same as that provided in the API.'
      );

      assert.equal(
        family?.amount,
        room?.price,
        'The amount the family has to pay should be equal to the price of the room.'
      );

      assert.equal(
        room?.status,
        'OCCUPIED',
        'The status of the room should be updated to "OCCUPIED"'
      );

      assert.include(
        {
          name: familyData.membersList[0].name,
          email: familyData.membersList[0].email,
          mobile: familyData.membersList[0].mobile,
          birthDay: new Date(familyData.membersList[0].birthDay).toISOString(),
        },
        {
          name: members[0].name,
          email: members[0].email!,
          mobile: members[0].mobile!,
          birthDay: members[0].birthDay.toISOString(),
        },
        'Created members should have same information as provided in the API.'
      );
      assert.include(
        {
          name: familyData.membersList[1].name,
          email: familyData.membersList[1].email,
          mobile: familyData.membersList[1].mobile,
          birthDay: new Date(familyData.membersList[1].birthDay).toISOString(),
        },
        {
          name: members[1].name,
          email: members[1].email!,
          mobile: members[1].mobile!,
          birthDay: members[1].birthDay.toISOString(),
        },
        'Created members should have same information as provided in the API.'
      );
    });
  });

  describe('Error case', () => {
    it('should return 401 status code if bearer token is invalid.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const apiResult1 = await request.post('/rooms/1/families');
      assert.equal(
        apiResult1.status,
        401,
        'API should return 401 response code if the bearer token is not provided.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult2 = await request
        .post('/rooms/1/families')
        .set('Authorization', 'Bearer invalidtoken');
      assert.equal(
        apiResult2.status,
        401,
        'API should return 401 response code if invalid bearer token is provided.'
      );
    });

    it('should return 422 status code if invalid name is provided.', async () => {
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

      // calling API to create a room.
      const roomData = {
        name: 'Room 1',
        description: 'Description for Room 1',
        price: 5000,
      };
      await request
        .post('/rooms')
        .send(roomData)
        .set('Authorization', `Bearer ${token}`);
      const room = await Room.findOne({ where: { name: roomData.name } });

      /** calling the test api------------------------------------------------------------------------ */
      const familyData1 = {
        name: '',
        sourceOfIncome: 'Software engineer job',
        membersList: [
          {
            name: 'Member 1',
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: '1998-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult1 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData1)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult1.status,
        422,
        'API should return 422 status if empty string is provided in name.'
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
      const familyData2 = {
        sourceOfIncome: 'Software engineer job',
        membersList: [
          {
            name: 'Member 1',
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: '1998-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult2 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData2)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult2.status,
        422,
        'API should return 422 status if name is not provided.'
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
      const familyData3 = {
        name: largeTestString,
        sourceOfIncome: 'Software engineer job',
        membersList: [
          {
            name: 'Member 1',
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: '1998-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult3 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData3)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult3.status,
        422,
        'API should return 422 status if string with characters greater than 255 is provided in name.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult3.body.errors.details[0],
        {
          path: ['name'],
        },
        'API should return the error details for name if string with characters greater than 255 is provided in name.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const familyData4 = {
        name: null,
        sourceOfIncome: 'Software engineer job',
        membersList: [
          {
            name: 'Member 1',
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: '1998-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult4 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData4)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult4.status,
        422,
        'API should return 422 status if null is provided in name.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult4.body.errors.details[0],
        {
          path: ['name'],
        },
        'API should return the error details for name if null is provided in name.'
      );
    });

    it('should return 422 status code if invalid sourceOfIncome is provided.', async () => {
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

      // calling API to create a room.
      const roomData = {
        name: 'Room 1',
        description: 'Description for Room 1',
        price: 5000,
      };
      await request
        .post('/rooms')
        .send(roomData)
        .set('Authorization', `Bearer ${token}`);
      const room = await Room.findOne({ where: { name: roomData.name } });

      /** calling the test api------------------------------------------------------------------------ */
      const familyData1 = {
        name: 'Family 1',
        sourceOfIncome: '',
        membersList: [
          {
            name: 'Member 1',
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: '1998-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult1 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData1)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult1.status,
        422,
        'API should return 422 status if empty string is provided in sourceOfIncome.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult1.body.errors.details[0],
        {
          path: ['sourceOfIncome'],
        },
        'API should return the error details for sourceOfIncome if empty string is provided in sourceOfIncome.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const familyData2 = {
        name: 'Family 1',
        membersList: [
          {
            name: 'Member 1',
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: '1998-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult2 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData2)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult2.status,
        422,
        'API should return 422 status if sourceOfIncome is not provided.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult2.body.errors.details[0],
        {
          path: ['sourceOfIncome'],
        },
        'API should return the error details for sourceOfIncome if sourceOfIncome is not provided.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const familyData3 = {
        name: 'Family 1',
        sourceOfIncome: largeTestString,
        membersList: [
          {
            name: 'Member 1',
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: '1998-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult3 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData3)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult3.status,
        422,
        'API should return 422 status if string with characters greater than 255 is provided in sourceOfIncome.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult3.body.errors.details[0],
        {
          path: ['sourceOfIncome'],
        },
        'API should return the error details for sourceOfIncome if string with characters greater than 255 is provided in sourceOfIncome.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const familyData4 = {
        name: 'Family 1',
        sourceOfIncome: null,
        membersList: [
          {
            name: 'Member 1',
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: '1998-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult4 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData4)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult4.status,
        422,
        'API should return 422 status if null is provided in sourceOfIncome.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult4.body.errors.details[0],
        {
          path: ['sourceOfIncome'],
        },
        'API should return the error details for sourceOfIncome if null is provided in sourceOfIncome.'
      );
    });

    it('should return 422 status code if invalid membersList name is provided.', async () => {
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

      // calling API to create a room.
      const roomData = {
        name: 'Room 1',
        description: 'Description for Room 1',
        price: 5000,
      };
      await request
        .post('/rooms')
        .send(roomData)
        .set('Authorization', `Bearer ${token}`);
      const room = await Room.findOne({ where: { name: roomData.name } });

      /** calling the test api------------------------------------------------------------------------ */
      const familyData1 = {
        name: 'Family 1',
        sourceOfIncome: 'Some job',
        membersList: [
          {
            name: '',
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: '1998-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult1 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData1)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult1.status,
        422,
        'API should return 422 status if empty string is provided in membersList name.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult1.body.errors.details[0],
        {
          path: ['membersList', 0, 'name'],
        },
        'API should return the error details for membersList name if empty string is provided in membersList name.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const familyData2 = {
        name: 'Family 1',
        sourceOfIncome: 'Some job',
        membersList: [
          {
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: '1998-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult2 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData2)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult2.status,
        422,
        'API should return 422 status if membersList name is not provided.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult2.body.errors.details[0],
        {
          path: ['membersList', 0, 'name'],
        },
        'API should return the error details for membersList name if membersList name is not provided.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const familyData3 = {
        name: 'Family 1',
        sourceOfIncome: 'Some job',
        membersList: [
          {
            name: largeTestString,
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: '1998-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult3 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData3)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult3.status,
        422,
        'API should return 422 status if string with characters greater than 255 is provided in membersList name.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult3.body.errors.details[0],
        {
          path: ['membersList', 0, 'name'],
        },
        'API should return the error details for membersList name if string with characters greater than 255 is provided in membersList name.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const familyData4 = {
        name: 'Family 1',
        sourceOfIncome: 'Some job',
        membersList: [
          {
            name: null,
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: '1998-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult4 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData4)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult4.status,
        422,
        'API should return 422 status if null is provided in membersList name.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult4.body.errors.details[0],
        {
          path: ['membersList', 0, 'name'],
        },
        'API should return the error details for membersList name if null is provided in membersList name.'
      );
    });

    it('should return 422 status code if invalid membersList birthDay is provided.', async () => {
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

      // calling API to create a room.
      const roomData = {
        name: 'Room 1',
        description: 'Description for Room 1',
        price: 5000,
      };
      await request
        .post('/rooms')
        .send(roomData)
        .set('Authorization', `Bearer ${token}`);
      const room = await Room.findOne({ where: { name: roomData.name } });

      /** calling the test api------------------------------------------------------------------------ */
      const familyData1 = {
        name: 'Family 1',
        sourceOfIncome: 'Some job',
        membersList: [
          {
            name: 'Member 1',
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: '',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult1 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData1)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult1.status,
        422,
        'API should return 422 status if empty string is provided in membersList birthDay.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult1.body.errors.details[0],
        {
          path: ['membersList', 0, 'birthDay'],
        },
        'API should return the error details for membersList birthDay if empty string is provided in membersList birthDay.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const familyData2 = {
        name: 'Family 1',
        sourceOfIncome: 'Some job',
        membersList: [
          {
            name: 'Member 1',
            email: 'member1@rentmag.com',
            mobile: '9876543210',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult2 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData2)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult2.status,
        422,
        'API should return 422 status if membersList birthDay is not provided.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult2.body.errors.details[0],
        {
          path: ['membersList', 0, 'birthDay'],
        },
        'API should return the error details for membersList birthDay if membersList birthDay is not provided.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const familyData3 = {
        name: 'Family 1',
        sourceOfIncome: 'Some job',
        membersList: [
          {
            name: 'Member 1',
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: 'asdfasdfasdf',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult3 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData3)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult3.status,
        422,
        'API should return 422 status if invalid date is provided in membersList birthDay.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult3.body.errors.details[0],
        {
          path: ['membersList', 0, 'birthDay'],
        },
        'API should return the error details for membersList birthDay if invalid date is provided in membersList birthDay.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const familyData4 = {
        name: 'Family 1',
        sourceOfIncome: 'Some job',
        membersList: [
          {
            name: 'Member 1',
            email: 'member1@rentmag.com',
            mobile: '9876543210',
            birthDay: null,
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult4 = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData4)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult4.status,
        422,
        'API should return 422 status if null is provided in membersList birthDay.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult4.body.errors.details[0],
        {
          path: ['membersList', 0, 'birthDay'],
        },
        'API should return the error details for membersList birthDay if null is provided in membersList birthDay.'
      );
    });

    it('should return 422 status code if invalid membersList email is provided.', async () => {
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

      // calling API to create a room.
      const roomData = {
        name: 'Room 1',
        description: 'Description for Room 1',
        price: 5000,
      };
      await request
        .post('/rooms')
        .send(roomData)
        .set('Authorization', `Bearer ${token}`);
      const room = await Room.findOne({ where: { name: roomData.name } });

      /** calling the test api------------------------------------------------------------------------ */
      const familyData = {
        name: 'Family 1',
        sourceOfIncome: 'Some job',
        membersList: [
          {
            name: 'Member 1',
            email: 'zxczxczxc',
            mobile: '9876543210',
            birthDay: '1999-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult.status,
        422,
        'API should return 422 status if invalid membersList email is provided.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult.body.errors.details[0],
        {
          path: ['membersList', 0, 'email'],
        },
        'API should return the error details for membersList email if invalid membersList email is provided.'
      );
    });

    it('should return 422 status code if invalid membersList mobile is provided.', async () => {
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

      // calling API to create a room.
      const roomData = {
        name: 'Room 1',
        description: 'Description for Room 1',
        price: 5000,
      };
      await request
        .post('/rooms')
        .send(roomData)
        .set('Authorization', `Bearer ${token}`);
      const room = await Room.findOne({ where: { name: roomData.name } });

      /** calling the test api------------------------------------------------------------------------ */
      const familyData = {
        name: 'Family 1',
        sourceOfIncome: 'Some job',
        membersList: [
          {
            name: 'Member 1',
            email: 'member1@rentmag.com',
            mobile: '123456789123456789123456789',
            birthDay: '1999-01-01',
          },
          {
            name: 'Member 2',
            email: 'member2@rentmag.com',
            mobile: '9876543211',
            birthDay: '1999-01-01',
          },
        ],
      };
      const apiResult = await request
        .post(`/rooms/${room?.id}/families`)
        .send(familyData)
        .set('Authorization', `Bearer ${token}`);

      assert.equal(
        apiResult.status,
        422,
        'API should return 422 status if string greater than 20 characters is provided in membersList mobile.'
      );

      /** checking the results------------------------------------------------------------------------ */
      assert.deepInclude(
        apiResult.body.errors.details[0],
        {
          path: ['membersList', 0, 'mobile'],
        },
        'API should return the error details for membersList mobile if string greater than 20 characters is provided in membersList mobile.'
      );
    });
  });
});
