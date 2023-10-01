<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230808201607 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX uniq_4b3656604584665a');
        $this->addSql('ALTER TABLE stock ALTER product_id DROP NOT NULL');
        $this->addSql('CREATE INDEX IDX_4B3656604584665A ON stock (product_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP INDEX IDX_4B3656604584665A');
        $this->addSql('ALTER TABLE stock ALTER product_id SET NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX uniq_4b3656604584665a ON stock (product_id)');
    }
}
