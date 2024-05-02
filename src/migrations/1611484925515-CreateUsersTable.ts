import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1611484925515 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE users (
            id UUID NOT NULL,
            firstName varchar(255) NOT NULL,
            lastName varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            password varchar(255) NOT NULL,
            PRIMARY KEY (id)
        );`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
}
