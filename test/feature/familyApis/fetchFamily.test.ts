import supertest from 'supertest';
import app from '@root/app';
import { Room, User } from '@root/database/models';
import { assert } from 'chai';

const request = supertest(app);

describe('Family APIs', () => {
  describe('GET /families/:familyId', () => {
    it('should return 401 and an error message if bearer token is not provided.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const apiResult = await request.get(`/families/1`);

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
        .get(`/families/1`)
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

    it('should return 404 and an error message if the family doesnt exist.', async () => {
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
        .get(`/families/1`)
        .set('Authorization', `Bearer ${token}`);

      /** checking the results------------------------------------------------------------------------ */
      assert.equal(
        apiResult.status,
        404,
        'API should return 404 if the family with the given id doesnt exist.'
      );
      assert.include(
        apiResult.body,
        {
          success: false,
          message: 'Family not found.',
        },
        'API should return proper message if the family with the given id doesnt exist.'
      );
    });

    it('should return 200 with family info along with its members, room and price info.', async () => {
      /** creating dependencies----------------------------------------------------------------------- */
      // creating a user for auth token.
      const user = await User.create({
        email: 'admin@admin.com',
        password: 'password',
        name: 'admin',
      });
      const token = user.generateToken();
      // calling api to create a new room to act as the current room for the family.
      await request
        .post('/rooms')
        .send({
          name: 'Current Room',
          price: 5000,
        })
        .set('Authorization', `Bearer ${token}`);
      const currentRoom = await Room.findOne({
        where: { name: 'Current Room' },
      });

      // calling api to add new family to the current room.
      await request
        .post(`/rooms/${currentRoom?.id}/families`)
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
      const family = await currentRoom?.getFamily()!;

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult = await request
        .get(`/families/${family.id}`)
        .set('Authorization', `Bearer ${token}`);

      /** checking the results------------------------------------------------------------------------ */
      await family.reload({ include: ['room', 'histories', 'members'] });
      assert.equal(
        apiResult.status,
        200,
        'API should return 200 if all the provided data are valid.'
      );

      const familyInApiResult = apiResult.body.data.family;
      assert.include(
        familyInApiResult,
        {
          id: family.id,
          roomId: currentRoom?.id,
          name: family.name,
          status: family.status,
          sourceOfIncome: family.sourceOfIncome,
          createdAt: family.createdAt.toISOString(),
          updatedAt: family.updatedAt.toISOString(),
        },
        'API should return the family info if all the data are valid.'
      );

      const members = family.members!;
      const membersInApiResult = familyInApiResult.members;
      assert.include(
        membersInApiResult[0],
        {
          id: members[0].id,
          familyId: family.id,
          name: members[0].name,
          email: members[0].email,
          mobile: members[0].mobile,
          birthDay: members[0].birthDay.toISOString(),
          createdAt: members[0].createdAt.toISOString(),
          updatedAt: members[0].updatedAt.toISOString(),
        },
        'API should return the members info along with the family info if all the data are valid.'
      );

      await currentRoom?.reload();
      const roomInApiResult = familyInApiResult.room;
      assert.include(
        roomInApiResult,
        {
          id: currentRoom?.id,
          name: currentRoom?.name,
          price: currentRoom?.price,
          createdAt: currentRoom?.createdAt.toISOString(),
          updatedAt: currentRoom?.updatedAt.toISOString(),
        },
        'API should return the room info along with the family info if all the data are valid.'
      );

      const histories = await family.getHistories()!;
      const historyInApiResult = familyInApiResult.histories;
      assert.include(
        historyInApiResult[0],
        {
          id: histories[0].id,
          familyId: histories[0].familyId,
          roomId: histories[0].roomId,
          createdAt: histories[0].createdAt.toISOString(),
          updatedAt: histories[0].updatedAt.toISOString(),
        },
        'API should return the price info along with the family info if all the data are valid.'
      );
    });
  });
});
