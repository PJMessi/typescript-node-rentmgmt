module.exports.up = async (queryInterface, DataTypes) => {
  await queryInterface.createTable('members', {
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

    name: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    email: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    mobile: {
      allowNull: true,
      type: DataTypes.STRING,
    },

    birthDay: {
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
  await queryInterface.dropTable('members');
};
