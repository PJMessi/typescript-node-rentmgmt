import supertest from 'supertest';
import app from '@root/app';
import { Room } from '@root/database/models';
import { assert } from 'chai';

const request = supertest(app);

describe('GET /rooms', () => {
  describe('Success case', () => {
    it('should return 200 status code with list of rooms with the family information.', async () => {
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

      // calling API to create a room1.
      const roomData1 = {
        name: 'Room 1',
        description: 'Description for Room 1',
        price: 5000,
      };
      await request
        .post('/rooms')
        .send(roomData1)
        .set('Authorization', `Bearer ${token}`);
      const room1 = await Room.findOne({ where: { name: roomData1.name } });

      // calling API to add a new family with members in room1.
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
      await request
        .post(`/rooms/${room1?.id}/families`)
        .send(familyData)
        .set('Authorization', `Bearer ${token}`);
      const family = await room1?.getFamily({ include: ['members'] })!;

      // calling API to create a room2.
      const roomData2 = {
        name: 'Room 2',
        description: 'Description for Room 2',
        price: 4000,
      };
      await request
        .post('/rooms')
        .send(roomData2)
        .set('Authorization', `Bearer ${token}`);
      const room2 = await Room.findOne({ where: { name: roomData2.name } });

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult = await request
        .get('/rooms')
        .set('Authorization', `Bearer ${token}`);
      assert.equal(
        apiResult.status,
        200,
        'API should return 200 status code on success case.'
      );

      /** checking the results------------------------------------------------------------------------ */
      await room1?.reload();
      const roomsInApiResult = apiResult.body.data.rooms;
      assert.include(
        roomsInApiResult[0],
        {
          id: room1?.id,
          name: room1?.name,
          description: room1?.description,
          price: room1?.price,
          createdAt: room1?.createdAt.toISOString(),
          updatedAt: room1?.updatedAt.toISOString(),
        },
        'API should return correct room information.'
      );

      assert.include(
        roomsInApiResult[0].family,
        {
          id: family.id,
          name: family.name,
          amount: family.amount,
          createdAt: family.createdAt.toISOString(),
          updatedAt: family.updatedAt.toISOString(),
        },
        'API should return correct family information.'
      );

      await room2?.reload();
      assert.include(
        roomsInApiResult[1],
        {
          id: room2?.id,
          name: room2?.name,
          description: room2?.description,
          price: room2?.price,
          createdAt: room2?.createdAt.toISOString(),
          updatedAt: room2?.updatedAt.toISOString(),
        },
        'API should return correct room information.'
      );

      assert.equal(
        roomsInApiResult[1].family,
        null,
        'API should return correct family information.'
      );
    });
  });

  describe('Error case', () => {
    it('should return 401 status code if bearer token is invalid.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const apiResult1 = await request.get('/rooms');
      assert.equal(
        apiResult1.status,
        401,
        'API should return 401 response code if the bearer token is not provided.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult2 = await request
        .get('/rooms')
        .set('Authorization', 'Bearer invalidtoken');
      assert.equal(
        apiResult2.status,
        401,
        'API should return 401 response code if invalid bearer token is provided.'
      );
    });
  });
});
