module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      admin: { type: DataTypes.BOOLEAN, allowNull: false }
    },
    {
      timestamps: true,
      underscored: true
    }
  );
  return User;
};
