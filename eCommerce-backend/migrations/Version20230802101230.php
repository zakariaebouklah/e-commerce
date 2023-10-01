<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230802101230 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE client DROP CONSTRAINT FK_C74404551AD5CDBF');
        $this->addSql('ALTER TABLE client ADD CONSTRAINT FK_C74404551AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE client DROP CONSTRAINT fk_c74404551ad5cdbf');
        $this->addSql('ALTER TABLE client ADD CONSTRAINT fk_c74404551ad5cdbf FOREIGN KEY (cart_id) REFERENCES wish_list (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
