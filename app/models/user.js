module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      id: { type: DataTypes.INTEGER },
      firstName: { type: DataTypes.STRING },
      lastName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING }
    },
    {
      timestamps: true
    }
  );
  return User;
};
