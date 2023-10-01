<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230906151805 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $hashedPassword1 = '$2y$13$YO5bs9S57blNFWNzDjz4aONpbqe6Higqnb2zV1TpDxBQa8VBcSq7i';
        $hashedPassword2 = '$2y$13$MYkke1Y.1GXvCgzTT0aGLuyIYLJmrki2HzCKLk8qfhyq79P7AiB0O';
        $hashedPassword3 = '$2y$13$0LG10F6Xf4UEW9WNiOqcuuF5yr2OMpAR9WPkZRezSPRc1o2CYWZ4C';

        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql("INSERT INTO client (id, email, roles, password, username, phone) VALUES (1, 'herbolab.admin1@herbolab.org', :roles, :password, 'Admin1', :phone)",
                        [
                            "roles" => json_encode(["ROLE_ADMIN", "ROLE_USER"]),
                            "password" => $hashedPassword1,
                            "phone" => "+212652439268"
                        ]);
        $this->addSql("INSERT INTO client (id, email, roles, password, username, phone) VALUES (2, 'herbolab.admin2@herbolab.org', :roles, :password, 'Admin2', :phone)",
                        [
                            "roles" => json_encode(["ROLE_ADMIN", "ROLE_USER"]),
                            "password" => $hashedPassword2,
                            "phone" => "+212652439268"
                        ]);
        $this->addSql("INSERT INTO client (id, email, roles, password, username, phone) VALUES (3, 'herbolab.admin3@herbolab.org', :roles, :password, 'Admin3', :phone)",
                        [
                            "roles" => json_encode(["ROLE_ADMIN", "ROLE_USER"]),
                            "password" => $hashedPassword3,
                            "phone" => "+212652439268"
                        ]);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DELETE FROM client');
    }
}
