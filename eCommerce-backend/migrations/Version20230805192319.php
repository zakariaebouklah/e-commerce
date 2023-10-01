<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230805192319 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE promotion DROP code');
        $this->addSql('ALTER TABLE promotion ALTER starts_at DROP NOT NULL');
        $this->addSql('ALTER TABLE promotion ALTER ends_at DROP NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE promotion ADD code VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE promotion ALTER starts_at SET NOT NULL');
        $this->addSql('ALTER TABLE promotion ALTER ends_at SET NOT NULL');
    }
}
