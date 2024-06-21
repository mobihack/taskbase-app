import bcrypt from 'bcrypt';

const bcryptService = () => {
  const password = (user: { password: string }) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(user.password, salt);

    return hash;
  };

  const comparePassword = (pw: string, hash: string) =>
    bcrypt.compareSync(pw, hash);

  return {
    password,
    comparePassword,
  };
};

export { bcryptService };
