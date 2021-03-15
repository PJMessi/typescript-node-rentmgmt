import supertest from 'supertest';
import app from '@root/app';
import { Room, User } from '@root/database/models';
import { assert } from 'chai';

const request = supertest(app);

describe('Family APIs', () => {
  describe('GET /families', () => {
    describe('success tests', () => {
      it('should return 200 with the list of all the rooms along in asc order with their members.', async () => {
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
        const room1 = await Room.findOne({
          where: { name: 'Room 1' },
        });

        // calling api to create another new room.
        await request
          .post('/rooms')
          .send({
            name: 'Room 2',
            price: 5000,
          })
          .set('Authorization', `Bearer ${token}`);
        const room2 = await Room.findOne({
          where: { name: 'Room 2' },
        });

        /** calling the test api------------------------------------------------------------------------ */
        const apiResult = await request
          .get(`/rooms`)
          .set('Authorization', `Bearer ${token}`);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(apiResult.status, 200, 'API should return 200 response.');
        assert.include(
          apiResult.body.data.rooms[0],
          {
            id: room1?.id,
            price: room1?.price,
            status: room1?.status,
            createdAt: room1?.createdAt.toISOString(),
            updatedAt: room1?.updatedAt.toISOString(),
          },
          'API should return the list of all the rooms in asc order including room1.'
        );
        assert.include(
          apiResult.body.data.rooms[1],
          {
            id: room2?.id,
            price: room2?.price,
            status: room2?.status,
            createdAt: room2?.createdAt.toISOString(),
            updatedAt: room2?.updatedAt.toISOString(),
          },
          'API should return the list of all the rooms in asc order including room2.'
        );
      });
    });

    describe('error condition tests', () => {
      it('should return 401 and an error message if bearer token is not provided.', async () => {
        /** calling the test api------------------------------------------------------------------------ */
        const apiResult = await request.get(`/rooms`);

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
          .get(`/rooms`)
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
    });
  });
});
