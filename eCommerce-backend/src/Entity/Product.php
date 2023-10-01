<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[Groups("product")]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups("product")]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[Groups("product")]
    #[ORM\Column]
    private ?float $price = null;

    #[Groups("product")]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[Groups("product")]
    #[ORM\Column]
    private ?bool $inStock = null;

    #[Groups("product")]
    #[ORM\Column]
    private ?\DateTimeImmutable $releasedAt = null;

    #[Groups("product")]
    #[ORM\Column(nullable: true)]
    private ?float $ratingAvg = null;

    #[ORM\ManyToOne(inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    private ?SubCategory $subCategory = null;

    #[ORM\ManyToMany(targetEntity: WishList::class, mappedBy: 'products', cascade: ['persist', 'remove'])]
    private Collection $wishLists;

    #[Groups("product")]
    #[ORM\OneToMany(mappedBy: 'product', targetEntity: Review::class, cascade: ['persist', 'remove'])]
    private Collection $reviews;

    #[Groups("product")]
    #[ORM\OneToMany(mappedBy: 'product', targetEntity: ProductImage::class, cascade: ['persist', 'remove'])]
    private Collection $images;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: Promotion::class, cascade: ['persist', 'remove'])]
    private Collection $promotions;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: CommandLine::class, cascade: ['persist', 'remove'])]
    private Collection $commandLines;

    #[Groups("product")]
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[Groups("product")]
    #[ORM\Column(nullable: true)]
    private ?float $discountPrice = null;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: Stock::class, cascade: ['persist', 'remove'])]
    private Collection $stocks;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: Banner::class, cascade: ['persist', 'remove'])]
    private Collection $banners;

    #[Groups("product")]
    #[ORM\Column(nullable: true)]
    private ?float $weight = null;

    public function __construct()
    {
        $this->wishLists = new ArrayCollection();
        $this->reviews = new ArrayCollection();
        $this->images = new ArrayCollection();
        $this->promotions = new ArrayCollection();
        $this->commandLines = new ArrayCollection();
        $this->stocks = new ArrayCollection();
        $this->banners = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function isInStock(): ?bool
    {
        return $this->inStock;
    }

    public function setInStock(bool $inStock): static
    {
        $this->inStock = $inStock;

        return $this;
    }

    public function getReleasedAt(): ?\DateTimeImmutable
    {
        return $this->releasedAt;
    }

    public function setReleasedAt(\DateTimeImmutable $releasedAt): static
    {
        $this->releasedAt = $releasedAt;

        return $this;
    }

    public function getRatingAvg(): ?float
    {
        return $this->ratingAvg;
    }

    public function setRatingAvg(float $ratingAvg): static
    {
        $this->ratingAvg = $ratingAvg;

        return $this;
    }

    public function getSubCategory(): ?SubCategory
    {
        return $this->subCategory;
    }

    public function setSubCategory(?SubCategory $subCategory): static
    {
        $this->subCategory = $subCategory;

        return $this;
    }

    /**
     * @return Collection<int, WishList>
     */
    public function getWishLists(): Collection
    {
        return $this->wishLists;
    }

    public function addWishList(WishList $wishList): static
    {
        if (!$this->wishLists->contains($wishList)) {
            $this->wishLists->add($wishList);
            $wishList->addProduct($this);
        }

        return $this;
    }

    public function removeWishList(WishList $wishList): static
    {
        if ($this->wishLists->removeElement($wishList)) {
            $wishList->removeProduct($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Review>
     */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    public function addReview(Review $review): static
    {
        if (!$this->reviews->contains($review)) {
            $this->reviews->add($review);
            $review->setProduct($this);
        }

        return $this;
    }

    public function removeReview(Review $review): static
    {
        if ($this->reviews->removeElement($review)) {
            // set the owning side to null (unless already changed)
            if ($review->getProduct() === $this) {
                $review->setProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ProductImage>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(ProductImage $image): static
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
            $image->setProduct($this);
        }

        return $this;
    }

    public function removeImage(ProductImage $image): static
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getProduct() === $this) {
                $image->setProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Promotion>
     */
    public function getPromotions(): Collection
    {
        return $this->promotions;
    }

    public function addPromotion(Promotion $promotion): static
    {
        if (!$this->promotions->contains($promotion)) {
            $this->promotions->add($promotion);
            $promotion->setProduct($this);
        }

        return $this;
    }

    public function removePromotion(Promotion $promotion): static
    {
        if ($this->promotions->removeElement($promotion)) {
            // set the owning side to null (unless already changed)
            if ($promotion->getProduct() === $this) {
                $promotion->setProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, CommandLine>
     */
    public function getCommandLines(): Collection
    {
        return $this->commandLines;
    }

    public function addCommandLine(CommandLine $commandLine): static
    {
        if (!$this->commandLines->contains($commandLine)) {
            $this->commandLines->add($commandLine);
            $commandLine->setProduct($this);
        }

        return $this;
    }

    public function removeCommandLine(CommandLine $commandLine): static
    {
        if ($this->commandLines->removeElement($commandLine)) {
            // set the owning side to null (unless already changed)
            if ($commandLine->getProduct() === $this) {
                $commandLine->setProduct(null);
            }
        }

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

    public function getDiscountPrice(): ?float
    {
        return $this->discountPrice;
    }

    public function setDiscountPrice(?float $discountPrice): static
    {
        $this->discountPrice = $discountPrice;

        return $this;
    }

    /**
     * @return Collection<int, Stock>
     */
    public function getStocks(): Collection
    {
        return $this->stocks;
    }

    public function addStock(Stock $stock): static
    {
        if (!$this->stocks->contains($stock)) {
            $this->stocks->add($stock);
            $stock->setProduct($this);
        }

        return $this;
    }

    public function removeStock(Stock $stock): static
    {
        if ($this->stocks->removeElement($stock)) {
            // set the owning side to null (unless already changed)
            if ($stock->getProduct() === $this) {
                $stock->setProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Banner>
     */
    public function getBanner(): Collection
    {
        return $this->banners;
    }

    public function addBanner(Banner $banner): static
    {
        if (!$this->banners->contains($banner)) {
            $this->banners->add($banner);
            $banner->setProduct($this);
        }

        return $this;
    }

    public function removeBanner(Banner $banner): static
    {
        if ($this->banners->removeElement($banner)) {
            // set the owning side to null (unless already changed)
            if ($banner->getProduct() === $this) {
                $banner->setProduct(null);
            }
        }

        return $this;
    }

    public function getWeight(): ?float
    {
        return $this->weight;
    }

    public function setWeight(?float $weight): static
    {
        $this->weight = $weight;

        return $this;
    }

}
