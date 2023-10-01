<?php

namespace App\Entity;

use App\Repository\DeliveryRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DeliveryRepository::class)]
class Delivery
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?float $cost = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $destinationAddress = null;

    #[ORM\Column]
    private ?int $minDays = null;

    #[ORM\Column]
    private ?int $maxDays = null;

    #[ORM\ManyToOne(inversedBy: 'delivery')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Order $clientOrder = null;

    #[ORM\ManyToOne(inversedBy: 'deliveries')]
    #[ORM\JoinColumn(nullable: false)]
    private ?DeliveryCompany $deliveryCompany = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCost(): ?float
    {
        return $this->cost;
    }

    public function setCost(float $cost): static
    {
        $this->cost = $cost;

        return $this;
    }

    public function getDestinationAddress(): ?string
    {
        return $this->destinationAddress;
    }

    public function setDestinationAddress(string $destinationAddress): static
    {
        $this->destinationAddress = $destinationAddress;

        return $this;
    }

    public function getMinDays(): ?int
    {
        return $this->minDays;
    }

    public function setMinDays(int $minDays): static
    {
        $this->minDays = $minDays;

        return $this;
    }

    public function getMaxDays(): ?int
    {
        return $this->maxDays;
    }

    public function setMaxDays(int $maxDays): static
    {
        $this->maxDays = $maxDays;

        return $this;
    }

    public function getClientOrder(): ?Order
    {
        return $this->clientOrder;
    }

    public function setClientOrder(?Order $clientOrder): static
    {
        $this->clientOrder = $clientOrder;

        return $this;
    }

    public function getDeliveryCompany(): ?DeliveryCompany
    {
        return $this->deliveryCompany;
    }

    public function setDeliveryCompany(?DeliveryCompany $deliveryCompany): static
    {
        $this->deliveryCompany = $deliveryCompany;

        return $this;
    }
}
