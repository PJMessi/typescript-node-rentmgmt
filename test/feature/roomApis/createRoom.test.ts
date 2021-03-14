import supertest from 'supertest';
import app from '@root/app';
import { assert } from 'chai';
import { Room, User } from '@root/database/models';

const request = supertest(app);

describe('Room APIs', () => {
  describe('POST /rooms', () => {
    describe('success tests', () => {
      it('should create new room and return room info if the valid data are provided.', async () => {
        /** creating dependencies----------------------------------------------------------------------- */
        // creating a user for auth token.
        const user = await User.create({
          email: 'admin@admin.com',
          password: 'password',
          name: 'admin',
        });
        const token = user.generateToken();

        /** calling the test api------------------------------------------------------------------------ */
        const roomData = {
          name: 'Room 1',
          description: 'Description',
          price: 5000,
        };
        const apiResult = await request
          .post(`/rooms`)
          .set('Authorization', `Bearer ${token}`)
          .send(roomData);

        /** checking the results------------------------------------------------------------------------ */
        assert.equal(
          apiResult.status,
          200,
          'API should return 200 if all the provided data are valid.'
        );

        const room = await Room.findOne({ where: { name: roomData.name } });
        assert.include(
          { description: room?.description, price: room?.price },
          { description: roomData.description, price: roomData.price },
          'The created room should contiain the same attributes values that were provided.'
        );

        assert.include(
          apiResult.body.data.room,
          {
            id: room?.id,
            name: room?.name,
            price: room?.price,
            description: room?.description,
            createdAt: room?.createdAt.toISOString(),
            updatedAt: room?.updatedAt.toISOString(),
          },
          'API should return the created room info if all the provided data are valid.'
        );
      });
    });

    describe('error condition tests', () => {
      it('should return 401 and an error message if bearer token is not provided.', async () => {
        /** calling the test api------------------------------------------------------------------------ */
        const apiResult = await request.post(`/rooms`);

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
          .post(`/rooms`)
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

      describe('validation tests', () => {
        it('should throw validation error if name is not provided or has greater than 255 characters.', async () => {
          /** creating dependencies----------------------------------------------------------------------- */
          // creating a user for auth token.
          const user = await User.create({
            email: 'admin@admin.com',
            password: 'password',
            name: 'admin',
          });
          const token = user.generateToken();

          /** calling the test api------------------------------------------------------------------------ */
          const roomData = {
            description: 'Description',
            price: 5000,
          };
          const apiResult = await request
            .post(`/rooms`)
            .set('Authorization', `Bearer ${token}`)
            .send(roomData);

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
          const roomData2 = {
            name: '',
            description: 'Description',
            price: 5000,
          };
          const apiResult2 = await request
            .post(`/rooms`)
            .set('Authorization', `Bearer ${token}`)
            .send(roomData2);

          /** checking the results------------------------------------------------------------------------ */
          assert.equal(
            apiResult2.status,
            422,
            'API should return 422 if empty string is provided in name field.'
          );
          assert.deepInclude(
            apiResult2.body.errors.details[0],
            {
              path: ['name'],
            },
            'API should include contain error details for name field if empty string is provided in name field.'
          );

          /** calling the test api------------------------------------------------------------------------ */
          const roomData3 = {
            name:
              'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            description: 'Description',
            price: 5000,
          };
          const apiResult3 = await request
            .post(`/rooms`)
            .set('Authorization', `Bearer ${token}`)
            .send(roomData3);

          /** checking the results------------------------------------------------------------------------ */
          assert.equal(
            apiResult3.status,
            422,
            'API should return 422 if name is greater than 255 characters.'
          );
          assert.deepInclude(
            apiResult3.body.errors.details[0],
            {
              path: ['name'],
            },
            'API should include contain error details for name field if name is greater than 255 characters.'
          );
        });

        it('should throw validation error if price is not provided or is greater than 999999.99.', async () => {
          /** creating dependencies----------------------------------------------------------------------- */
          // creating a user for auth token.
          const user = await User.create({
            email: 'admin@admin.com',
            password: 'password',
            name: 'admin',
          });
          const token = user.generateToken();

          /** calling the test api------------------------------------------------------------------------ */
          const roomData = {
            name: 'Room name',
            description: 'Description',
          };
          const apiResult = await request
            .post(`/rooms`)
            .set('Authorization', `Bearer ${token}`)
            .send(roomData);

          /** checking the results------------------------------------------------------------------------ */
          assert.equal(
            apiResult.status,
            422,
            'API should return 422 if the price field is not provided.'
          );
          assert.deepInclude(
            apiResult.body.errors.details[0],
            {
              path: ['price'],
            },
            'API should include contain error details for name field if the price field is not provided.'
          );

          /** calling the test api------------------------------------------------------------------------ */
          const roomData2 = {
            name: 'Room name',
            description: 'Description',
            price: '',
          };
          const apiResult2 = await request
            .post(`/rooms`)
            .set('Authorization', `Bearer ${token}`)
            .send(roomData2);

          /** checking the results------------------------------------------------------------------------ */
          assert.equal(
            apiResult2.status,
            422,
            'API should return 422 if empty string is provided in price field.'
          );
          assert.deepInclude(
            apiResult2.body.errors.details[0],
            {
              path: ['price'],
            },
            'API should include contain error details for price field if empty string is provided in price field.'
          );

          /** calling the test api------------------------------------------------------------------------ */
          const roomData3 = {
            name: 'Room name',
            description: 'Description',
            price: 999999999999,
          };
          const apiResult3 = await request
            .post(`/rooms`)
            .set('Authorization', `Bearer ${token}`)
            .send(roomData3);

          /** checking the results------------------------------------------------------------------------ */
          assert.equal(
            apiResult3.status,
            422,
            'API should return 422 if price is greater than 999999.99.'
          );
          assert.deepInclude(
            apiResult3.body.errors.details[0],
            {
              path: ['price'],
            },
            'API should include contain error details for price field if price is greater than 999999.99.'
          );
        });

        it('should throw validaton error if description has greater than 255 characters.', async () => {
          /** creating dependencies----------------------------------------------------------------------- */
          // creating a user for auth token.
          const user = await User.create({
            email: 'admin@admin.com',
            password: 'password',
            name: 'admin',
          });
          const token = user.generateToken();

          /** calling the test api------------------------------------------------------------------------ */
          const roomData = {
            name: 'Room name',
            price: 5000,
            description:
              'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          };
          const apiResult = await request
            .post(`/rooms`)
            .set('Authorization', `Bearer ${token}`)
            .send(roomData);

          /** checking the results------------------------------------------------------------------------ */
          assert.equal(
            apiResult.status,
            422,
            'API should return 422 if the description is greater than 255 characters.'
          );
          assert.deepInclude(
            apiResult.body.errors.details[0],
            {
              path: ['description'],
            },
            'API should include contain error details for name field if the description is greater than 255 characters'
          );
        });
      });
    });
  });
});
