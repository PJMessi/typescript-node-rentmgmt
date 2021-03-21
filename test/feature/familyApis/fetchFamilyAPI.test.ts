import supertest from 'supertest';
import app from '@root/app';
import { Room } from '@root/database/models';
import { assert } from 'chai';

const request = supertest(app);

describe('GET /families/:familyId', () => {
  describe('Success case', () => {
    it('should return 200 status code with the room, its room and members.', async () => {
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

      // calling API to create new room.
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

      // calling API to add family to the room.
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
        .post(`/rooms/${room?.id}/families`)
        .send(familyData)
        .set('Authorization', `Bearer ${token}`);
      const family = await room?.getFamily({ include: ['members'] })!;
      const members = family.members!;

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult = await request
        .get(`/families/${family?.id}`)
        .set('Authorization', `Bearer ${token}`);
      assert.equal(
        apiResult.status,
        200,
        'API should return 200 status code on success case.'
      );

      /** checking the results------------------------------------------------------------------------ */
      const familyInApiResult = apiResult.body.data.family;
      assert.include(
        familyInApiResult,
        {
          id: family?.id,
          name: family?.name,
          sourceOfIncome: family?.sourceOfIncome,
          status: family?.status,
          amount: family?.amount,
          createdAt: family?.createdAt.toISOString(),
          updatedAt: family?.updatedAt.toISOString(),
        },
        'API should return correct family information.'
      );

      const membersInApiResult = familyInApiResult.members;
      assert.include(
        membersInApiResult[0],
        {
          id: members[0].id,
          name: members[0]?.name,
          email: members[0]?.email,
          mobile: members[0]?.mobile,
          birthDay: members[0]?.birthDay.toISOString(),
          createdAt: members[0]?.createdAt.toISOString(),
          updatedAt: members[0]?.updatedAt.toISOString(),
        },
        'API should return correct members information.'
      );
      assert.include(
        membersInApiResult[1],
        {
          id: members[1].id,
          name: members[1]?.name,
          email: members[1]?.email,
          mobile: members[1]?.mobile,
          birthDay: members[1]?.birthDay.toISOString(),
          createdAt: members[1]?.createdAt.toISOString(),
          updatedAt: members[1]?.updatedAt.toISOString(),
        },
        'API should return correct members information.'
      );

      await room?.reload();
      const roomInApiResult = familyInApiResult.room;
      assert.include(roomInApiResult, {
        id: room?.id,
        name: room?.name,
        description: room?.description,
        status: room?.status,
        price: room?.price,
        createdAt: room?.createdAt.toISOString(),
        updatedAt: room?.updatedAt.toISOString(),
      });
    });
  });

  describe('Error case', () => {
    it('should return 401 status code if bearer token is invalid.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const apiResult1 = await request.get('/families/1');
      assert.equal(
        apiResult1.status,
        401,
        'API should return 401 response code if the bearer token is not provided.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult2 = await request
        .get('/families/1')
        .set('Authorization', 'Bearer invalidtoken');
      assert.equal(
        apiResult2.status,
        401,
        'API should return 401 response code if invalid bearer token is provided.'
      );
    });

    it('should return 404 status code if the family with the given id doesnt exist.', async () => {
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
      const apiResult = await request
        .get('/families/1')
        .set('Authorization', `Bearer ${token}`);
      assert.equal(
        apiResult.status,
        404,
        'API should return 404 response code if the room with the given id doesnt exist.'
      );

      /** calling the test api------------------------------------------------------------------------ */
      assert.equal(
        apiResult.body.message,
        'Family not found.',
        'API should return proper error message.'
      );
    });
  });
});
