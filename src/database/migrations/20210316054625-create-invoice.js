module.exports.up = async (queryInterface, DataTypes) => {
  await queryInterface.createTable('invoices', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
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

    startDate: {
      allowNull: true,
      type: DataTypes.DATE,
    },

    endDate: {
      allowNull: true,
      type: DataTypes.DATE,
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
  await queryInterface.dropTable('invoices');
};
