module.exports.up = async (queryInterface, DataTypes) => {
  await queryInterface.createTable('priceInformation', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },

    roomId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'rooms',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    familyId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'families',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    amount: {
      allowNull: true,
      type: DataTypes.DECIMAL(8, 2),
    },

    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },

    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },

    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  });
};

module.exports.down = async (queryInterface) => {
  await queryInterface.dropTable('priceInformation');
};
