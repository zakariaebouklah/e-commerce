<?php

namespace App\Entity;

use App\Repository\BannerRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BannerRepository::class)]
class Banner
{
    #[Groups("banner")]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups("banner")]
    #[ORM\Column(length: 255)]
    private ?string $bannerFile = null;

    #[Groups("banner")]
    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[Groups("banner")]
    #[ORM\ManyToOne(inversedBy: 'banner')]
    private ?Product $product = null;

    #[Groups("banner")]
    #[ORM\ManyToOne(inversedBy: 'banner')]
    private ?SubCategory $subCategory = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBannerFile(): ?string
    {
        return $this->bannerFile;
    }

    public function setBannerFile(string $bannerFile): static
    {
        $this->bannerFile = $bannerFile;

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

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): static
    {
        $this->product = $product;

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
}
