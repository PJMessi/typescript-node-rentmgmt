import { assert } from 'chai';
import { Family, Room, RoomFamilyHistory } from '../../src/database/models';
import { changeRoom } from '../../src/services/family/family.service';

describe('Family service', () => {
  describe('removeCurrentRoom()', () => {
    it('should assign the given family to the given room and return the family instance with related members, room and histories.', async () => {
      /** creating dependencies. */
      const currentRoom = await Room.create({
        name: 'Room 1',
        status: 'OCCUPIED',
        price: 5000,
      });

      const family = await Family.create({
        roomId: currentRoom.id,
        name: 'Family 1',
        status: 'ACTIVE',
        sourceOfIncome: 'Some job',
      });

      const currentHistory = await RoomFamilyHistory.create({
        roomId: currentRoom.id,
        familyId: family.id,
        amount: currentRoom.price,
      });

      const newRoom = await Room.create({
        name: 'Room 2',
        status: 'EMPTY',
        price: 5000,
      });

      /** calling the function to be tested. */
      const result = await changeRoom(family.id, newRoom.id);

      /** checking the results. */
      await currentRoom.reload();
      assert.equal(
        currentRoom.status,
        'EMPTY',
        "The status of the previous room should be 'EMPTY'"
      );

      await newRoom.reload();
      assert.equal(
        newRoom.status,
        'OCCUPIED',
        "The status of the previous room should be 'OCCUPIED'"
      );

      await currentHistory.reload({ paranoid: false });
      assert.isNotNull(
        currentHistory.deletedAt,
        'The information about the previous room and family should be soft deleted.'
      );

      const newHistory = await family.getHistories();
      assert.include(
        newHistory[0],
        {
          familyId: family.id,
          roomId: newRoom.id,
          amount: newRoom.price,
        },
        'The information about the new room and family should be added.'
      );

      assert.containsAllKeys(
        result.toJSON(),
        ['histories', 'room', 'members'],
        'The returned result should contain the family information along with the new history, new room and its members.'
      );
    });

    it('should throw 400 error if the given family is already assigned to the given room.', async () => {
      /** creating dependencies. */
      const currentRoom = await Room.create({
        name: 'Room 1',
        status: 'OCCUPIED',
        price: 5000,
      });

      const family = await Family.create({
        roomId: currentRoom.id,
        name: 'Family 1',
        status: 'ACTIVE',
        sourceOfIncome: 'Some job',
      });

      try {
        /** calling the function to be tested. */
        changeRoom(family.id, currentRoom.id);
      } catch (error) {
        /** checking the results. */
        assert.include(error, {
          status: 400,
          message: 'Family already assigned the room.',
        });
      }
    });

    it('should throw 400 error if the status of the given room is "OCCUPIED".', async () => {
      /** creating dependencies. */
      const currentRoom = await Room.create({
        name: 'Room 1',
        status: 'OCCUPIED',
        price: 5000,
      });

      const family = await Family.create({
        roomId: currentRoom.id,
        name: 'Family 1',
        status: 'ACTIVE',
        sourceOfIncome: 'Some job',
      });

      const newRoom = await Room.create({
        name: 'Room 2',
        status: 'OCCUPIED',
        price: 5000,
      });

      try {
        /** calling the function to be tested. */
        changeRoom(family.id, newRoom.id);
      } catch (error) {
        /** checking the results. */
        assert.include(error, {
          status: 400,
          message: 'Room already occupied.',
        });
      }
    });

    it('should return 404 error, if the given family doesnt exist.', async () => {
      /** creating dependencies. */
      const newRoom = await Room.create({
        name: 'Room 2',
        status: 'EMPTY',
        price: 5000,
      });

      try {
        /** calling the function to be tested. */
        await changeRoom(111, newRoom.id);
      } catch (error) {
        /** checking the results. */
        assert.include(error, {
          status: 404,
          message: 'Family not found.',
        });
      }
    });

    it('should return 404 error, if the given room doesnt exist.', async () => {
      /** creating dependencies. */
      const currentRoom = await Room.create({
        name: 'Room 1',
        status: 'OCCUPIED',
        price: 5000,
      });

      const family = await Family.create({
        roomId: currentRoom.id,
        name: 'Family 1',
        status: 'ACTIVE',
        sourceOfIncome: 'Some job',
      });

      try {
        /** calling the function to be tested. */
        await changeRoom(family.id, 1111);
      } catch (error) {
        /** checking the results. */
        assert.include(error, {
          status: 404,
          message: 'Room not found.',
        });
      }
    });
  });
});
