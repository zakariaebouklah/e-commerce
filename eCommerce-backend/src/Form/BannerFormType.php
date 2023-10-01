<?php

namespace App\Form;

use App\Entity\Banner;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\File;

class BannerFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('bannerFile', FileType::class, [
                // make it optional so you don't have to re-upload the PDF file
                // every time you edit the Product details
                'required' => true,

                // unmapped fields can't define their validation using annotations
                // in the associated entity, so you can use the PHP constraint classes
                'constraints' => [
                    new File([
                        'maxSize' => '30M',
                        'mimeTypes' => [
                            'image/png',
                            'image/jpeg',
                            'image/avif',
                            'image/svg+xml',
                            'image/gif',
                            'video/x-flv',
                            'video/mp4',
                            'application/x-mpegURL',
                            'video/MP2T',
                            'video/3gpp',
                            'video/quicktime',
                            'video/x-msvideo',
                            'video/x-ms-wmv'
                        ],
                        'mimeTypesMessage' => 'Please upload a valid File [PNG | JPG | JPEG | GIF | MP4 | MOV...]',
                    ])
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Banner::class,
        ]);
    }
}
