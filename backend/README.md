## Notes

### Command to auto generate a table and migration

```
sequelize model:generate --name User --attributes name:string,email:string,phone:string,password:string,status:string,last_login_at:date,last_ip_address:string
```

### Command to migrate the db

```
docker-compose exec backend npx sequelize-cli db:migrate
```
