<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230810192519 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE banner ADD product_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE banner ADD sub_category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE banner ADD CONSTRAINT FK_6F9DB8E74584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE banner ADD CONSTRAINT FK_6F9DB8E7F7BFE87C FOREIGN KEY (sub_category_id) REFERENCES sub_category (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_6F9DB8E74584665A ON banner (product_id)');
        $this->addSql('CREATE INDEX IDX_6F9DB8E7F7BFE87C ON banner (sub_category_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE banner DROP CONSTRAINT FK_6F9DB8E74584665A');
        $this->addSql('ALTER TABLE banner DROP CONSTRAINT FK_6F9DB8E7F7BFE87C');
        $this->addSql('DROP INDEX IDX_6F9DB8E74584665A');
        $this->addSql('DROP INDEX IDX_6F9DB8E7F7BFE87C');
        $this->addSql('ALTER TABLE banner DROP product_id');
        $this->addSql('ALTER TABLE banner DROP sub_category_id');
    }
}
