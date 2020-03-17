module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define(
    'albums',
    {
      albumId: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      timestamps: true,
      underscored: true
    }
  );
  return Album;
};
