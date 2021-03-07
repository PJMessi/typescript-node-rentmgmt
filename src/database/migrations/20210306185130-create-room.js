module.exports.up = async (queryInterface, DataTypes) => {
  await queryInterface.createTable('rooms', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },

    name: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    description: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    status: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    price: {
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
  await queryInterface.dropTable('rooms');
};
