ALTER USER 'root' IDENTIFIED BY 'mysql_very_secret_root_password';
ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'mysql_very_secret_root_password';
ALTER USER 'docker' IDENTIFIED BY 'mysql_very_secret_docker_password';
ALTER USER 'docker' IDENTIFIED WITH mysql_native_password BY 'mysql_very_secret_docker_password';
FLUSH PRIVILEGES;

GRANT ALL PRIVILEGES ON *.* TO 'docker'@'%';
COMMIT;
