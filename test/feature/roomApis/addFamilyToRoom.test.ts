import supertest from 'supertest';
import app from '@root/app';
import { assert } from 'chai';
import { Family, Member, Room, User } from '@root/database/models';

const request = supertest(app);

describe('POST /rooms/room:Id/families', () => {
  describe('success', () => {
    it('should add new family to the room and return the family info along with the members.', async () => {
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

      /** calling the test api------------------------------------------------------------------------ */
      const familyData = {
        name: 'Family name',
        sourceOfIncome: 'Some job',
        membersList: [
          {
            name: 'Member name',
            email: 'member@rentmag.com',
            mobile: '9876543210',
            birthDay: '2021/01/01',
          },
        ],
      };
      const apiResult = await request
        .post(`/rooms/${room?.id}/families`)
        .set('Authorization', `Bearer ${token}`)
        .send(familyData);

      /** checking the results------------------------------------------------------------------------ */
      assert.equal(apiResult.status, 200, 'API should return 200 response.');

      const family = await Family.findOne({ where: { name: 'Family name' } });
      const familyInApiResult = apiResult.body.data.family;
      assert.include(familyInApiResult, {
        id: family?.id,
        name: family?.name,
        status: family?.status,
        createdAt: family?.createdAt.toISOString(),
        updatedAt: family?.updatedAt.toISOString(),
      });

      const members = await Member.findAll({ where: { familyId: family?.id } });
      const membersInApiResult = familyInApiResult.members;
      assert.include(membersInApiResult[0], {
        id: members[0]?.id,
        familyId: members[0]?.familyId,
        email: members[0]?.email,
        mobile: members[0]?.mobile,
        birthDay: members[0]?.birthDay.toISOString(),
        createdAt: members[0]?.createdAt.toISOString(),
        updatedAt: members[0]?.updatedAt.toISOString(),
      });
    });

    it('should update the status of th room to "OCCUPIED"', async () => {
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

      /** calling the test api------------------------------------------------------------------------ */
      const familyData = {
        name: 'Family name',
        sourceOfIncome: 'Some job',
        membersList: [
          {
            name: 'Member name',
            email: 'member@rentmag.com',
            mobile: '9876543210',
            birthDay: '2021/01/01',
          },
        ],
      };
      await request
        .post(`/rooms/${room?.id}/families`)
        .set('Authorization', `Bearer ${token}`)
        .send(familyData);

      /** checking the results------------------------------------------------------------------------ */
      await room?.reload();
      assert.equal(room?.status, 'OCCUPIED');
    });
  });

  describe('error', () => {
    it('should return 401 and an error message if bearer token is not provided.', async () => {
      /** calling the test api------------------------------------------------------------------------ */
      const apiResult = await request.post(`/rooms/1/families`);

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
        .post(`/rooms/1/families`)
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
      const familyData = {
        name: 'Family name',
        sourceOfIncome: 'Some job',
        membersList: [
          {
            name: 'Member name',
            email: 'member@rentmag.com',
            mobile: '9876543210',
            birthDay: '2021/01/01',
          },
        ],
      };
      const apiResult = await request
        .post(`/rooms/1/families`)
        .set('Authorization', `Bearer ${token}`)
        .send(familyData);

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

    it('should return 400 and an error message if the room is already occupied by some other families.', async () => {
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

      // calling api to add a family to the room.
      await request
        .post(`/rooms/${room?.id}/families`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Another Family name',
          sourceOfIncome: 'Some job',
          membersList: [
            {
              name: 'Another member name',
              email: 'anothermember@rentmag.com',
              mobile: '9876543210',
              birthDay: '2021/01/01',
            },
          ],
        });

      /** calling the test api------------------------------------------------------------------------ */
      const familyData = {
        name: 'Family name',
        sourceOfIncome: 'Some job',
        membersList: [
          {
            name: 'Member name',
            email: 'member@rentmag.com',
            mobile: '9876543210',
            birthDay: '2021/01/01',
          },
        ],
      };
      const apiResult = await request
        .post(`/rooms/${room?.id}/families`)
        .set('Authorization', `Bearer ${token}`)
        .send(familyData);

      /** checking the results------------------------------------------------------------------------ */
      assert.equal(
        apiResult.status,
        400,
        'API should return 400 if the room is already occupied by other some other family.'
      );

      assert.include(
        apiResult.body,
        {
          success: false,
          message: 'Room already occupied.',
        },
        'API should return proper message if the room is already occupied by some other family.'
      );
    });

    describe('validation', () => {
      it('should return 422 and error details if name is not provided or has greater than 255 characters.', async () => {
        /** creating dependencies----------------------------------------------------------------------- */
        // creating a user for auth token.
        const user = await User.create({
          email: 'admin@admin.com',
          password: 'password',
          name: 'admin',
        });
        const token = user.generateToken();

        // calling api to create a new room.
        const roomData = {
          name: 'Room 1',
          description: 'Description',
          price: 5000,
        };
        await request
          .post(`/rooms`)
          .set('Authorization', `Bearer ${token}`)
          .send(roomData);
        const room = await Room.findOne({ where: { name: roomData.name } });

        /** calling the test api------------------------------------------------------------------------ */
        const familyData = {
          sourceOfIncome: 'Some job',
          membersList: [
            {
              name: 'Member name',
              email: 'member@rentmag.com',
              mobile: '9876543210',
              birthDay: '2021/01/01',
            },
          ],
        };
        const apiResult = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult.status,
          422,
          'API should return 422 if the name field is not provided.'
        );
        assert.deepInclude(
          apiResult.body.errors.details[0],
          {
            path: ['name'],
          },
          'API should include contain error details for name field if the name field is not provided.'
        );

        /** calling the test api------------------------------------------------------------------------ */
        const familyData2 = {
          name: '',
          sourceOfIncome: 'Some job',
          membersList: [
            {
              name: 'Member name',
              email: 'member@rentmag.com',
              mobile: '9876543210',
              birthDay: '2021/01/01',
            },
          ],
        };
        const apiResult2 = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData2);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult2.status,
          422,
          'API should return 422 if the name field is not provided.'
        );
        assert.deepInclude(
          apiResult2.body.errors.details[0],
          {
            path: ['name'],
          },
          'API should include contain error details for name field if empty string is provided in the name field.'
        );

        /** calling the test api------------------------------------------------------------------------ */
        const familyData3 = {
          name:
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          sourceOfIncome: 'Some job',
          membersList: [
            {
              name: 'Member name',
              email: 'member@rentmag.com',
              mobile: '9876543210',
              birthDay: '2021/01/01',
            },
          ],
        };
        const apiResult3 = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData3);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult3.status,
          422,
          'API should return 422 if the name field is not provided.'
        );
        assert.deepInclude(
          apiResult3.body.errors.details[0],
          {
            path: ['name'],
          },
          'API should include contain error details for name field if name is greater than 255 characters.'
        );
      });

      it('should return 422 and error details if sourceOfIncome is not provided or has greater than 255 characters.', async () => {
        /** creating dependencies----------------------------------------------------------------------- */
        // creating a user for auth token.
        const user = await User.create({
          email: 'admin@admin.com',
          password: 'password',
          name: 'admin',
        });
        const token = user.generateToken();

        // calling api to create a new room.
        const roomData = {
          name: 'Room 1',
          description: 'Description',
          price: 5000,
        };
        await request
          .post(`/rooms`)
          .set('Authorization', `Bearer ${token}`)
          .send(roomData);
        const room = await Room.findOne({ where: { name: roomData.name } });

        /** calling the test api------------------------------------------------------------------------ */
        const familyData = {
          name: 'Family name',
          membersList: [
            {
              name: 'Member name',
              email: 'member@rentmag.com',
              mobile: '9876543210',
              birthDay: '2021/01/01',
            },
          ],
        };
        const apiResult = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult.status,
          422,
          'API should return 422 if the sourceOfIncome field is not provided.'
        );
        assert.deepInclude(
          apiResult.body.errors.details[0],
          {
            path: ['sourceOfIncome'],
          },
          'API should include contain error details for sourceOfIncome field if the sourceOfIncome field is not provided.'
        );

        /** calling the test api------------------------------------------------------------------------ */
        const familyData2 = {
          name: 'Family name',
          sourceOfIncome: '',
          membersList: [
            {
              name: 'Member name',
              email: 'member@rentmag.com',
              mobile: '9876543210',
              birthDay: '2021/01/01',
            },
          ],
        };
        const apiResult2 = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData2);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult2.status,
          422,
          'API should return 422 if the sourceOfIncome field is not provided.'
        );
        assert.deepInclude(
          apiResult2.body.errors.details[0],
          {
            path: ['sourceOfIncome'],
          },
          'API should include contain error details for sourceOfIncome field if empty string is provided in the sourceOfIncome field.'
        );

        /** calling the test api------------------------------------------------------------------------ */
        const familyData3 = {
          sourceOfIncome:
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          name: 'Family name',
          membersList: [
            {
              name: 'Member name',
              email: 'member@rentmag.com',
              mobile: '9876543210',
              birthDay: '2021/01/01',
            },
          ],
        };
        const apiResult3 = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData3);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult3.status,
          422,
          'API should return 422 if the sourceOfIncome field is not provided.'
        );
        assert.deepInclude(
          apiResult3.body.errors.details[0],
          {
            path: ['sourceOfIncome'],
          },
          'API should include contain error details for sourceOfIncome field if sourceOfIncome is greater than 255 characters.'
        );
      });

      it('should return 422 and error details if memberList name is not provided or has greater than 255 characters.', async () => {
        /** creating dependencies----------------------------------------------------------------------- */
        // creating a user for auth token.
        const user = await User.create({
          email: 'admin@admin.com',
          password: 'password',
          name: 'admin',
        });
        const token = user.generateToken();

        // calling api to create a new room.
        const roomData = {
          name: 'Room 1',
          description: 'Description',
          price: 5000,
        };
        await request
          .post(`/rooms`)
          .set('Authorization', `Bearer ${token}`)
          .send(roomData);
        const room = await Room.findOne({ where: { name: roomData.name } });

        /** calling the test api------------------------------------------------------------------------ */
        const familyData = {
          name: 'Family name',
          sourceOfIncome: 'Some job',
          membersList: [
            {
              email: 'member@rentmag.com',
              mobile: '9876543210',
              birthDay: '2021/01/01',
            },
          ],
        };
        const apiResult = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult.status,
          422,
          'API should return 422 if the memberList.name field is not provided.'
        );
        assert.deepInclude(
          apiResult.body.errors.details[0],
          {
            path: ['membersList', 0, 'name'],
          },
          'API should include contain error details for memberList.name field it is not provided.'
        );

        /** calling the test api------------------------------------------------------------------------ */
        const familyData2 = {
          name: 'Family name',
          sourceOfIncome: 'Some job',
          membersList: [
            {
              name: '',
              email: 'member@rentmag.com',
              mobile: '9876543210',
              birthDay: '2021/01/01',
            },
          ],
        };
        const apiResult2 = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData2);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult2.status,
          422,
          'API should return 422 if the empty string is provided in membersList.name.'
        );
        assert.deepInclude(
          apiResult2.body.errors.details[0],
          {
            path: ['membersList', 0, 'name'],
          },
          'API should include contain error details for memberList.name field if its provided with empty string.'
        );

        /** calling the test api------------------------------------------------------------------------ */
        const familyData3 = {
          sourceOfIncome: 'Some job',
          name: 'Family name',
          membersList: [
            {
              name:
                'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
              email: 'member@rentmag.com',
              mobile: '9876543210',
              birthDay: '2021/01/01',
            },
          ],
        };
        const apiResult3 = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData3);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult3.status,
          422,
          'API should return 422 if the memberList.name field is not provided.'
        );
        assert.deepInclude(
          apiResult3.body.errors.details[0],
          {
            path: ['membersList', 0, 'name'],
          },
          'API should include contain error details for memberList.name field if its provided with string greater than 255 characters.'
        );
      });

      it('should return 422 and error details if member email is invalid.', async () => {
        /** creating dependencies----------------------------------------------------------------------- */
        // creating a user for auth token.
        const user = await User.create({
          email: 'admin@admin.com',
          password: 'password',
          name: 'admin',
        });
        const token = user.generateToken();

        // calling api to create a new room.
        const roomData = {
          name: 'Room 1',
          description: 'Description',
          price: 5000,
        };
        await request
          .post(`/rooms`)
          .set('Authorization', `Bearer ${token}`)
          .send(roomData);
        const room = await Room.findOne({ where: { name: roomData.name } });

        /** calling the test api------------------------------------------------------------------------ */
        const familyData = {
          name: 'Family name',
          sourceOfIncome: 'Some job',
          membersList: [
            {
              email: '',
              name: 'Member name',
              mobile: '9876543210',
              birthDay: '2021/01/01',
            },
          ],
        };
        const apiResult = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult.status,
          422,
          'API should return 422 if the memberList.email is provided with empty string.'
        );
        assert.deepInclude(
          apiResult.body.errors.details[0],
          {
            path: ['membersList', 0, 'email'],
          },
          'API should include contain error details for memberList.email is provided with empty string.'
        );

        /** calling the test api------------------------------------------------------------------------ */
        const familyData2 = {
          name: 'Family name',
          sourceOfIncome: 'Some job',
          membersList: [
            {
              name: 'Member name',
              email: 'memasdasdasdasdas',
              mobile: '9876543210',
              birthDay: '2021/01/01',
            },
          ],
        };
        const apiResult2 = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData2);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult2.status,
          422,
          'API should return 422 if invalid email is provided in membersList.email.'
        );
        assert.deepInclude(
          apiResult2.body.errors.details[0],
          {
            path: ['membersList', 0, 'email'],
          },
          'API should include contain error details for memberList.email field if its provided with invalid email.'
        );
      });

      it('should return 422 and error details if member mobile is greater than 20 characters.', async () => {
        /** creating dependencies----------------------------------------------------------------------- */
        // creating a user for auth token.
        const user = await User.create({
          email: 'admin@admin.com',
          password: 'password',
          name: 'admin',
        });
        const token = user.generateToken();

        // calling api to create a new room.
        const roomData = {
          name: 'Room 1',
          description: 'Description',
          price: 5000,
        };
        await request
          .post(`/rooms`)
          .set('Authorization', `Bearer ${token}`)
          .send(roomData);
        const room = await Room.findOne({ where: { name: roomData.name } });

        /** calling the test api------------------------------------------------------------------------ */
        const familyData = {
          name: 'Family name',
          sourceOfIncome: 'Some job',
          membersList: [
            {
              email: 'member@rentmag.com',
              name: 'Member name',
              mobile: '',
              birthDay: '2021/01/01',
            },
          ],
        };
        const apiResult = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult.status,
          422,
          'API should return 422 if the memberList.mobile is provided with empty string.'
        );
        assert.deepInclude(
          apiResult.body.errors.details[0],
          {
            path: ['membersList', 0, 'mobile'],
          },
          'API should include contain error details for memberList.mobile is provided with empty string.'
        );

        /** calling the test api------------------------------------------------------------------------ */
        const familyData2 = {
          name: 'Family name',
          sourceOfIncome: 'Some job',
          membersList: [
            {
              name: 'Member name',
              email: 'member@rentmag.com',
              mobile:
                '9876543210sadad54635as4d6a4s35d4a635s4d3as4d35as4d3a4sd3',
              birthDay: '2021/01/01',
            },
          ],
        };
        const apiResult2 = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData2);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult2.status,
          422,
          'API should return 422 if string with characters length greater than 20 is provided in membersList.email.'
        );
        assert.deepInclude(
          apiResult2.body.errors.details[0],
          {
            path: ['membersList', 0, 'mobile'],
          },
          'API should include contain error details for memberList.email field if its provided with string greater than 20 characters length.'
        );
      });

      it('should return 422 and error details if member birthday is not provided or is invalid.', async () => {
        /** creating dependencies----------------------------------------------------------------------- */
        // creating a user for auth token.
        const user = await User.create({
          email: 'admin@admin.com',
          password: 'password',
          name: 'admin',
        });
        const token = user.generateToken();

        // calling api to create a new room.
        const roomData = {
          name: 'Room 1',
          description: 'Description',
          price: 5000,
        };
        await request
          .post(`/rooms`)
          .set('Authorization', `Bearer ${token}`)
          .send(roomData);
        const room = await Room.findOne({ where: { name: roomData.name } });

        /** calling the test api------------------------------------------------------------------------ */
        const familyData = {
          name: 'Family name',
          sourceOfIncome: 'Some job',
          membersList: [
            {
              name: 'Member name',
              email: 'member@rentmag.com',
              mobile: '9876543210',
            },
          ],
        };
        const apiResult = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult.status,
          422,
          'API should return 422 if the memberList.birthDay field is not provided.'
        );
        assert.deepInclude(
          apiResult.body.errors.details[0],
          {
            path: ['membersList', 0, 'birthDay'],
          },
          'API should include contain error details for memberList.birthDay field it is not provided.'
        );

        /** calling the test api------------------------------------------------------------------------ */
        const familyData2 = {
          name: 'Family name',
          sourceOfIncome: 'Some job',
          membersList: [
            {
              name: 'Member name',
              email: 'member@rentmag.com',
              mobile: '9876543210',
              birthDay: '',
            },
          ],
        };
        const apiResult2 = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData2);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult2.status,
          422,
          'API should return 422 if the empty string is provided in membersList.birthDay.'
        );
        assert.deepInclude(
          apiResult2.body.errors.details[0],
          {
            path: ['membersList', 0, 'birthDay'],
          },
          'API should include contain error details for memberList.birthDay field if its provided with empty string.'
        );

        /** calling the test api------------------------------------------------------------------------ */
        const familyData3 = {
          sourceOfIncome: 'Some job',
          name: 'Family name',
          membersList: [
            {
              name: 'Member name',
              email: 'member@rentmag.com',
              mobile: '9876543210',
              birthDay: 'zxczxcasdsdasdas',
            },
          ],
        };
        const apiResult3 = await request
          .post(`/rooms/${room?.id}/families`)
          .set('Authorization', `Bearer ${token}`)
          .send(familyData3);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult3.status,
          422,
          'API should return 422 if the memberList.birthDay is provided with invalid date format.'
        );
        assert.deepInclude(
          apiResult3.body.errors.details[0],
          {
            path: ['membersList', 0, 'birthDay'],
          },
          'API should include contain error details for memberList.birthDay field if its provided with invalid date format.'
        );
      });
    });
  });
});
