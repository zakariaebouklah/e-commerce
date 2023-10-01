<?php

namespace App\Entity;

use App\Repository\SubCategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SubCategoryRepository::class)]
class SubCategory
{
    #[Groups("subCategory")]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups("subCategory")]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'subCategories')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null;

    #[Groups("subCategory")]
    #[ORM\OneToMany(mappedBy: 'subCategory', targetEntity: Product::class, cascade: ['persist', 'remove'])]
    private Collection $products;

    #[ORM\OneToMany(mappedBy: 'subCategory', targetEntity: Banner::class, cascade: ['persist', 'remove'])]
    private Collection $banners;

    public function __construct()
    {
        $this->products = new ArrayCollection();
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

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    /**
     * @return Collection<int, Product>
     */
    public function getProducts(): Collection
    {
        return $this->products;
    }

    public function addProduct(Product $product): static
    {
        if (!$this->products->contains($product)) {
            $this->products->add($product);
            $product->setSubCategory($this);
        }

        return $this;
    }

    public function removeProduct(Product $product): static
    {
        if ($this->products->removeElement($product)) {
            // set the owning side to null (unless already changed)
            if ($product->getSubCategory() === $this) {
                $product->setSubCategory(null);
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
            $banner->setSubCategory($this);
        }

        return $this;
    }

    public function removeBanner(Banner $banner): static
    {
        if ($this->banners->removeElement($banner)) {
            // set the owning side to null (unless already changed)
            if ($banner->getSubCategory() === $this) {
                $banner->setSubCategory(null);
            }
        }

        return $this;
    }

}
