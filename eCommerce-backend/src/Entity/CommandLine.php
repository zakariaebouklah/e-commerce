<?php

namespace App\Entity;

use App\Repository\CommandLineRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CommandLineRepository::class)]
class CommandLine
{
    #[Groups("order-line")]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups("order-line")]
    #[ORM\Column]
    private ?int $quantity = null;

    #[Groups("order-line")]
    #[ORM\ManyToOne(inversedBy: 'commandLines')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Product $product = null;

    #[ORM\ManyToOne(inversedBy: 'commandLines')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Cart $cart = null;

    #[Groups("order-line")]
    #[ORM\Column(nullable: false)]
    private ?float $totalLineCost = null;

    #[Groups("order-line")]
    #[ORM\Column(nullable: true)]
    private ?float $totalWeight = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): static
    {
        $this->product = $product;

        return $this;
    }

    public function getCart(): ?Cart
    {
        return $this->cart;
    }

    public function setCart(?Cart $cart): static
    {
        $this->cart = $cart;

        return $this;
    }

    public function getTotalLineCost(): ?float
    {
        return $this->totalLineCost;
    }

    public function setTotalLineCost(float $totalLineCost): static
    {
        $this->totalLineCost = $totalLineCost;

        return $this;
    }

    public function getTotalWeight(): ?float
    {
        return $this->totalWeight;
    }

    public function setTotalWeight(?float $totalWeight): static
    {
        $this->totalWeight = $totalWeight;

        return $this;
    }
}
