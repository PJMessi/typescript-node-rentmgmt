import supertest from 'supertest';
import app from '@root/app';
import { Member, Room, User } from '@root/database/models';
import { assert } from 'chai';

const request = supertest(app);

describe('GET /rooms/:roomId', () => {
  describe('success', () => {
    it('should return 200 with room info along with the info of the family and members in it.', async () => {
      /** creating dependencies----------------------------------------------------------------------- */
      // creating a user for auth token.
      const user = await User.create({
        email: 'admin@admin.com',
        password: 'password',
        name: 'admin',
      });
      const token = user.generateToken();

      // calling api to create a new room.
      await request
        .post('/rooms')
        .send({
          name: 'Room 1',
          price: 5000,
        })
        .set('Authorization', `Bearer ${token}`);
      const room = await Room.findOne({
        where: { name: 'Room 1' },
      });

      // calling api to add new family to the room.
      await request
        .post(`/rooms/${room?.id}/families`)
        .send({
          name: 'Test family',
          sourceOfIncome: 'Some jobs',
          membersList: [
            {
              name: 'Member 1',
              email: 'member1@rentmag.com',
              mobile: '9876543210',
              birthDay: '1998-01-01',
            },
          ],
        })
        .set('Authorization', `Bearer ${token}`);
      const family = await room?.getFamily()!;
      const member = await Member.findOne({
        where: { familyId: family?.id },
      });

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult = await request
        .get(`/rooms/${room?.id}`)
        .set('Authorization', `Bearer ${token}`);

      /** checking the results------------------------------------------------------------------------ */
      await room?.reload({ include: ['family'] });
      assert.equal(apiResult.status, 200, 'API should return 200 response.');

      const roomInApiResult = apiResult.body.data.room;
      assert.include(
        roomInApiResult,
        {
          id: room?.id,
          price: room?.price,
          name: room?.name,
          createdAt: room?.createdAt.toISOString(),
          updatedAt: room?.updatedAt.toISOString(),
        },
        'API should return the room info.'
      );

      const familyInApiResult = roomInApiResult.family;
      assert.include(familyInApiResult, {
        id: family?.id,
        name: family?.name,
        status: family?.status,
        createdAt: family?.createdAt.toISOString(),
        updatedAt: family?.updatedAt.toISOString(),
      });

      const membersInApiResult = familyInApiResult.members;
      assert.include(membersInApiResult[0], {
        id: member?.id,
        familyId: member?.familyId,
        email: member?.email,
        mobile: member?.mobile,
        birthDay: member?.birthDay.toISOString(),
        createdAt: member?.createdAt.toISOString(),
        updatedAt: member?.updatedAt.toISOString(),
      });
    });
  });

  describe('error', () => {
    it('should return 401 and an error message if bearer token is not provided.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const apiResult = await request.get(`/rooms/1`);

      /** checking the results------------------------------------------------------------------------ */
      assert.equal(
        apiResult.status,
        401,
        'API should return 401 if the bearer token is not provided.'
      );
      assert.include(
        apiResult.body,
        {
          success: false,
          message: 'Bearer token not provided.',
        },
        'API should return proper error message if the bearer token is not provided.'
      );
    });

    it('should return 401 and an error message if invalid bearer token is provided.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const apiResult = await request
        .get(`/rooms/1`)
        .set('Authorization', 'Bearer invalidbearertoken');

      /** checking the results------------------------------------------------------------------------ */
      assert.equal(
        apiResult.status,
        401,
        'API should return 401 if the bearer token is invalid.'
      );
      assert.include(
        apiResult.body,
        {
          success: false,
          message: 'Invalid bearer token.',
        },
        'API should return proper error message if invalid bearer token is provided.'
      );
    });

    it('should return 404 and an error message if the room doesnt exist.', async () => {
      /** creating dependencies----------------------------------------------------------------------- */
      // creating a user for auth token.
      const user = await User.create({
        email: 'admin@admin.com',
        password: 'password',
        name: 'admin',
      });
      const token = user.generateToken();

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult = await request
        .get(`/rooms/1`)
        .set('Authorization', `Bearer ${token}`);

      /** checking the results------------------------------------------------------------------------ */
      assert.equal(
        apiResult.status,
        404,
        'API should return 404 if the room with the given id doesnt exist.'
      );
      assert.include(
        apiResult.body,
        {
          success: false,
          message: 'Room not found.',
        },
        'API should return proper message if the room with the given id doesnt exist.'
      );
    });
  });
});
