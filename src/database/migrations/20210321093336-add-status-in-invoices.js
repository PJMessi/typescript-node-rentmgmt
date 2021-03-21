module.exports.up = async (queryInterface, DataTypes) => {
  await queryInterface.addColumn('invoices', 'status', {
    type: DataTypes.STRING,
    after: 'endDate',
    required: false,
  });
};

module.exports.down = async (queryInterface) => {
  await queryInterface.removeColumn('invoices', 'status');
};
