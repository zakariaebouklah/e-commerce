<?php

namespace App\Entity;

use App\Repository\OrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: '`order`')]
class Order
{
    #[Groups("order")]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups("order")]
    #[ORM\Column]
    private ?float $totalCost = null;

    #[Groups("order")]
    #[ORM\Column(nullable: true)]
    private ?float $weight = null;

    #[Groups("order")]
    #[ORM\OneToMany(mappedBy: 'clientOrder', targetEntity: Delivery::class)]
    private Collection $delivery;

    #[ORM\ManyToOne(inversedBy: 'orders')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Cart $cart = null;

    #[Groups("order")]
    #[ORM\ManyToOne(inversedBy: 'orders')]
    private ?Coupon $coupon = null;

    #[Groups("order")]
    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[Groups("order")]
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[Groups("order")]
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $purchasedAt = null;

    #[Groups("order")]
    #[ORM\ManyToOne(inversedBy: 'orders')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Client $client = null;

    #[Groups("order")]
    #[ORM\Column(nullable: true)]
    private ?float $discountTotalCost = null;

    public function __construct()
    {
        $this->delivery = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTotalCost(): ?float
    {
        return $this->totalCost;
    }

    public function setTotalCost(float $totalCost): static
    {
        $this->totalCost = $totalCost;

        return $this;
    }

    public function getWeight(): ?float
    {
        return $this->weight;
    }

    public function setWeight(float $weight): static
    {
        $this->weight = $weight;

        return $this;
    }

    /**
     * @return Collection<int, Delivery>
     */
    public function getDelivery(): Collection
    {
        return $this->delivery;
    }

    public function addDelivery(Delivery $delivery): static
    {
        if (!$this->delivery->contains($delivery)) {
            $this->delivery->add($delivery);
            $delivery->setClientOrder($this);
        }

        return $this;
    }

    public function removeDelivery(Delivery $delivery): static
    {
        if ($this->delivery->removeElement($delivery)) {
            // set the owning side to null (unless already changed)
            if ($delivery->getClientOrder() === $this) {
                $delivery->setClientOrder(null);
            }
        }

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

    public function getCoupon(): ?Coupon
    {
        return $this->coupon;
    }

    public function setCoupon(?Coupon $coupon): static
    {
        $this->coupon = $coupon;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getPurchasedAt(): ?\DateTimeImmutable
    {
        return $this->purchasedAt;
    }

    public function setPurchasedAt(?\DateTimeImmutable $purchasedAt): static
    {
        $this->purchasedAt = $purchasedAt;

        return $this;
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): static
    {
        $this->client = $client;

        return $this;
    }

    public function getDiscountTotalCost(): ?float
    {
        return $this->discountTotalCost;
    }

    public function setDiscountTotalCost(?float $discountTotalCost): static
    {
        $this->discountTotalCost = $discountTotalCost;

        return $this;
    }
}
