db.createUser({
  user: 'user',
  pwd: 'password',
  roles: [
    {
      role: 'userAdminAnyDatabase',
      db: 'admin',
    },
  ],
});
