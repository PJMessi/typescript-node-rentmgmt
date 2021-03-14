import supertest from 'supertest';
import app from '@root/app';
import { Family, Room, User } from '@root/database/models';
import { assert } from 'chai';

const request = supertest(app);

describe('Family APIs', () => {
  describe('POST /families/:familyId/rooms/:roomId/change', () => {
    it('should return 401 and an error message if bearer token is not provided.', async () => {
      /** calling the test api. */
      const apiResult = await request.post(`/families/1/rooms/1/change`);

      /** checking the results. */
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
      /** calling the test api. */
      const apiResult = await request
        .post(`/families/1/rooms/1/change`)
        .set('Authorization', 'Bearer invalidbearertoken');

      /** checking the results. */
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

      // calling api to create a new room for the family to move to.
      await request.post('/rooms').send({
        name: 'Current Room',
        price: 5000,
      });
      const newRoom = await Room.findOne({
        where: { name: 'Current Room' },
      });

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult = await request
        .post(`/families/11111/rooms/${newRoom?.id}/change`)
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

    it('should return 404 and an error message if the room doesnt exist.', async () => {
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

      // calling api to add the family along with the members to the current room.
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
      const family = await Family.findOne({
        where: {
          roomId: currentRoom?.id,
        },
      });

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult = await request
        .post(`/families/${family?.id}/rooms/11111/change`)
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

    it('should return 400 and an error message if the room is already assigned to the family.', async () => {
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

      // calling api to add the family along with the members to the current room.
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
        .post(`/families/${family.id}/rooms/${currentRoom?.id}/change`)
        .set('Authorization', `Bearer ${token}`);

      /** checking the results------------------------------------------------------------------------ */
      assert.equal(
        apiResult.status,
        400,
        'API should return 400 if the room is already occupied by the family.'
      );
      assert.include(
        apiResult.body,
        {
          success: false,
          message: 'Family already assigned the room.',
        },
        'API should return proper message if the room is already occupied by the family.'
      );
    });

    it('should return 400 and an error message if the room is already assigned to some other family.', async () => {
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

      // calling api to add the family along with the members to the current room.
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

      // calling api to create a new room for the family to move to.
      await request
        .post('/rooms')
        .send({
          name: 'New Room',
          price: 5000,
        })
        .set('Authorization', `Bearer ${token}`);
      const newRoom = await Room.findOne({
        where: { name: 'New Room' },
      });

      // calling api to add another family to the new room.
      await request
        .post(`/rooms/${newRoom?.id}/families`)
        .send({
          name: 'Test family',
          sourceOfIncome: 'Some jobs',
          membersList: [
            {
              name: 'Member 2',
              email: 'member2@rentmag.com',
              mobile: '9876543210',
              birthDay: '1998-01-01',
            },
          ],
        })
        .set('Authorization', `Bearer ${token}`);

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult = await request
        .post(`/families/${family.id}/rooms/${newRoom?.id}/change`)
        .set('Authorization', `Bearer ${token}`);

      /** checking the results------------------------------------------------------------------------ */
      assert.equal(
        apiResult.status,
        400,
        'API should return 400 if the room with the given id is already occupied by another family.'
      );
      assert.include(
        apiResult.body,
        {
          success: false,
          message: 'Room already occupied.',
        },
        'API should return proper message if the room is already occupied by another family.'
      );
    });

    it('should return 200 with updated family info along with its members, new room and new price info.', async () => {
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

      // calling api to add the family along with the members to the current room.
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

      // calling api to create a new room for the family to move to.
      await request
        .post('/rooms')
        .send({
          name: 'New Room',
          price: 5000,
        })
        .set('Authorization', `Bearer ${token}`);
      const newRoom = await Room.findOne({
        where: { name: 'New Room' },
      });

      /** calling the test api------------------------------------------------------------------------ */
      const apiResult = await request
        .post(`/families/${family.id}/rooms/${newRoom?.id}/change`)
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
          roomId: newRoom?.id,
          name: family.name,
          status: family.status,
          sourceOfIncome: family.sourceOfIncome,
          createdAt: family.createdAt.toISOString(),
          updatedAt: family.updatedAt.toISOString(),
        },
        'API should return the updated family info if all the data are valid.'
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

      await newRoom?.reload();
      const roomInApiResult = familyInApiResult.room;
      assert.include(
        roomInApiResult,
        {
          id: newRoom?.id,
          name: newRoom?.name,
          price: newRoom?.price,
          createdAt: newRoom?.createdAt.toISOString(),
          updatedAt: newRoom?.updatedAt.toISOString(),
        },
        'API should return the new room info along with the family info if all the data are valid.'
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
        'API should return the new price info along with the family info if all the data are valid.'
      );
    });

    it('should change the room of the family, update the status of the involved rooms and update the price history of the family.', async () => {
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

      // calling api to add the family along with the members to the current room.
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

      // calling api to create a new room for the family to move to.
      await request
        .post('/rooms')
        .send({
          name: 'New Room',
          price: 5000,
        })
        .set('Authorization', `Bearer ${token}`);
      const newRoom = await Room.findOne({
        where: { name: 'New Room' },
      });

      /** calling the test api------------------------------------------------------------------------ */
      await request
        .post(`/families/${family.id}/rooms/${newRoom?.id}/change`)
        .set('Authorization', `Bearer ${token}`);

      /** checking the results------------------------------------------------------------------------ */
      await family.reload();
      assert.equal(
        family.roomId,
        newRoom?.id,
        'The roomId for the family should be the id of the new room.'
      );

      await newRoom?.reload();
      assert.equal(
        newRoom?.status,
        'OCCUPIED',
        'The status of the new room should be "OCCUPIED".'
      );

      await currentRoom?.reload();
      assert.equal(
        currentRoom?.status,
        'EMPTY',
        'The status of the old room should be "EMPTY".'
      );

      const roomFamilyHistories = await family.getHistories();
      assert.include(
        roomFamilyHistories[0],
        {
          roomId: newRoom?.id!,
          amount: newRoom?.price!,
        },
        'There should be information about the family and the new room in "roomfamilyhistories" table.'
      );
    });
  });
});
