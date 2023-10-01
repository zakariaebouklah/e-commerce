<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230726111036 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE cart_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE category_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE command_line_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE delivery_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE delivery_company_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "order_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE product_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE product_image_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE promotion_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE review_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE stock_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE sub_category_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE wish_list_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE cart (id INT NOT NULL, modified_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN cart.modified_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE category (id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE command_line (id INT NOT NULL, product_id INT NOT NULL, cart_id INT NOT NULL, quantity INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_70BE1A7B4584665A ON command_line (product_id)');
        $this->addSql('CREATE INDEX IDX_70BE1A7B1AD5CDBF ON command_line (cart_id)');
        $this->addSql('CREATE TABLE delivery (id INT NOT NULL, client_order_id INT NOT NULL, delivery_company_id INT NOT NULL, cost DOUBLE PRECISION NOT NULL, destination_address TEXT NOT NULL, min_days INT NOT NULL, max_days INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_3781EC10A3795DFD ON delivery (client_order_id)');
        $this->addSql('CREATE INDEX IDX_3781EC1089DE8DF2 ON delivery (delivery_company_id)');
        $this->addSql('CREATE TABLE delivery_company (id INT NOT NULL, name VARCHAR(255) NOT NULL, phone VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE "order" (id INT NOT NULL, cart_id INT NOT NULL, ordered_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, total_cost DOUBLE PRECISION NOT NULL, weight DOUBLE PRECISION NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_F52993981AD5CDBF ON "order" (cart_id)');
        $this->addSql('COMMENT ON COLUMN "order".ordered_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE product (id INT NOT NULL, sub_category_id INT NOT NULL, name VARCHAR(255) NOT NULL, price DOUBLE PRECISION NOT NULL, description TEXT NOT NULL, in_stock BOOLEAN NOT NULL, released_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, rating_avg DOUBLE PRECISION NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D34A04ADF7BFE87C ON product (sub_category_id)');
        $this->addSql('COMMENT ON COLUMN product.released_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE product_image (id INT NOT NULL, product_id INT NOT NULL, image BYTEA NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_64617F034584665A ON product_image (product_id)');
        $this->addSql('CREATE TABLE promotion (id INT NOT NULL, product_id INT NOT NULL, percentage DOUBLE PRECISION NOT NULL, code VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C11D7DD14584665A ON promotion (product_id)');
        $this->addSql('CREATE TABLE review (id INT NOT NULL, client_id INT NOT NULL, product_id INT NOT NULL, snap_image BYTEA DEFAULT NULL, experience TEXT DEFAULT NULL, rate INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_794381C619EB6921 ON review (client_id)');
        $this->addSql('CREATE INDEX IDX_794381C64584665A ON review (product_id)');
        $this->addSql('CREATE TABLE stock (id INT NOT NULL, product_id INT NOT NULL, name VARCHAR(255) NOT NULL, quantity BIGINT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4B3656604584665A ON stock (product_id)');
        $this->addSql('CREATE TABLE sub_category (id INT NOT NULL, category_id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_BCE3F79812469DE2 ON sub_category (category_id)');
        $this->addSql('CREATE TABLE wish_list (id INT NOT NULL, modified_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN wish_list.modified_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE wish_list_product (wish_list_id INT NOT NULL, product_id INT NOT NULL, PRIMARY KEY(wish_list_id, product_id))');
        $this->addSql('CREATE INDEX IDX_9B7C1C9DD69F3311 ON wish_list_product (wish_list_id)');
        $this->addSql('CREATE INDEX IDX_9B7C1C9D4584665A ON wish_list_product (product_id)');
        $this->addSql('ALTER TABLE command_line ADD CONSTRAINT FK_70BE1A7B4584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE command_line ADD CONSTRAINT FK_70BE1A7B1AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE delivery ADD CONSTRAINT FK_3781EC10A3795DFD FOREIGN KEY (client_order_id) REFERENCES "order" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE delivery ADD CONSTRAINT FK_3781EC1089DE8DF2 FOREIGN KEY (delivery_company_id) REFERENCES delivery_company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "order" ADD CONSTRAINT FK_F52993981AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04ADF7BFE87C FOREIGN KEY (sub_category_id) REFERENCES sub_category (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE product_image ADD CONSTRAINT FK_64617F034584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE promotion ADD CONSTRAINT FK_C11D7DD14584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C619EB6921 FOREIGN KEY (client_id) REFERENCES client (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C64584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE stock ADD CONSTRAINT FK_4B3656604584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE sub_category ADD CONSTRAINT FK_BCE3F79812469DE2 FOREIGN KEY (category_id) REFERENCES category (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE wish_list_product ADD CONSTRAINT FK_9B7C1C9DD69F3311 FOREIGN KEY (wish_list_id) REFERENCES wish_list (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE wish_list_product ADD CONSTRAINT FK_9B7C1C9D4584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE client ADD wish_list_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE client ADD cart_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE client ADD profile_picture BYTEA DEFAULT NULL');
        $this->addSql('ALTER TABLE client ADD CONSTRAINT FK_C7440455D69F3311 FOREIGN KEY (wish_list_id) REFERENCES wish_list (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE client ADD CONSTRAINT FK_C74404551AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C7440455D69F3311 ON client (wish_list_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C74404551AD5CDBF ON client (cart_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE client DROP CONSTRAINT FK_C74404551AD5CDBF');
        $this->addSql('ALTER TABLE client DROP CONSTRAINT FK_C7440455D69F3311');
        $this->addSql('DROP SEQUENCE cart_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE category_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE command_line_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE delivery_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE delivery_company_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE "order_id_seq" CASCADE');
        $this->addSql('DROP SEQUENCE product_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE product_image_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE promotion_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE review_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE stock_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE sub_category_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE wish_list_id_seq CASCADE');
        $this->addSql('ALTER TABLE command_line DROP CONSTRAINT FK_70BE1A7B4584665A');
        $this->addSql('ALTER TABLE command_line DROP CONSTRAINT FK_70BE1A7B1AD5CDBF');
        $this->addSql('ALTER TABLE delivery DROP CONSTRAINT FK_3781EC10A3795DFD');
        $this->addSql('ALTER TABLE delivery DROP CONSTRAINT FK_3781EC1089DE8DF2');
        $this->addSql('ALTER TABLE "order" DROP CONSTRAINT FK_F52993981AD5CDBF');
        $this->addSql('ALTER TABLE product DROP CONSTRAINT FK_D34A04ADF7BFE87C');
        $this->addSql('ALTER TABLE product_image DROP CONSTRAINT FK_64617F034584665A');
        $this->addSql('ALTER TABLE promotion DROP CONSTRAINT FK_C11D7DD14584665A');
        $this->addSql('ALTER TABLE review DROP CONSTRAINT FK_794381C619EB6921');
        $this->addSql('ALTER TABLE review DROP CONSTRAINT FK_794381C64584665A');
        $this->addSql('ALTER TABLE stock DROP CONSTRAINT FK_4B3656604584665A');
        $this->addSql('ALTER TABLE sub_category DROP CONSTRAINT FK_BCE3F79812469DE2');
        $this->addSql('ALTER TABLE wish_list_product DROP CONSTRAINT FK_9B7C1C9DD69F3311');
        $this->addSql('ALTER TABLE wish_list_product DROP CONSTRAINT FK_9B7C1C9D4584665A');
        $this->addSql('DROP TABLE cart');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE command_line');
        $this->addSql('DROP TABLE delivery');
        $this->addSql('DROP TABLE delivery_company');
        $this->addSql('DROP TABLE "order"');
        $this->addSql('DROP TABLE product');
        $this->addSql('DROP TABLE product_image');
        $this->addSql('DROP TABLE promotion');
        $this->addSql('DROP TABLE review');
        $this->addSql('DROP TABLE stock');
        $this->addSql('DROP TABLE sub_category');
        $this->addSql('DROP TABLE wish_list');
        $this->addSql('DROP TABLE wish_list_product');
        $this->addSql('DROP INDEX UNIQ_C7440455D69F3311');
        $this->addSql('DROP INDEX UNIQ_C74404551AD5CDBF');
        $this->addSql('ALTER TABLE client DROP wish_list_id');
        $this->addSql('ALTER TABLE client DROP cart_id');
        $this->addSql('ALTER TABLE client DROP profile_picture');
    }
}
