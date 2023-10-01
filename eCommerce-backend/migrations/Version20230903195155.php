<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230903195155 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE command_line DROP CONSTRAINT FK_70BE1A7B1AD5CDBF');
        $this->addSql('ALTER TABLE command_line ADD CONSTRAINT FK_70BE1A7B1AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "order" DROP CONSTRAINT FK_F52993981AD5CDBF');
        $this->addSql('ALTER TABLE "order" ADD CONSTRAINT FK_F52993981AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE command_line DROP CONSTRAINT fk_70be1a7b1ad5cdbf');
        $this->addSql('ALTER TABLE command_line ADD CONSTRAINT fk_70be1a7b1ad5cdbf FOREIGN KEY (cart_id) REFERENCES cart (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "order" DROP CONSTRAINT fk_f52993981ad5cdbf');
        $this->addSql('ALTER TABLE "order" ADD CONSTRAINT fk_f52993981ad5cdbf FOREIGN KEY (cart_id) REFERENCES cart (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
