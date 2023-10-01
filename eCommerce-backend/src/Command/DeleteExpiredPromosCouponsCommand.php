<?php

namespace App\Command;

use App\Repository\CouponRepository;
use App\Repository\PromotionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:delete-expired-promos-coupons',
    description: 'Handles the task of deleting expired coupons and promotions',
)]
class DeleteExpiredPromosCouponsCommand extends Command
{
    public function __construct(private readonly EntityManagerInterface $manager,
                                private readonly PromotionRepository    $promotionRepository,
                                private readonly CouponRepository       $couponRepository,
                                string                                  $name = null)
    {
        parent::__construct($name);
    }

    protected function configure(): void
    {
        $this
            ->addArgument('arg1', InputArgument::OPTIONAL, 'Argument description')
            ->addOption('option1', null, InputOption::VALUE_NONE, 'Option description')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $expiredCoupons = $this->couponRepository->findExpiredCoupons();
        $expiredPromos = $this->promotionRepository->getExpiredPromos();

        if(count($expiredCoupons) > 0){
            foreach ($expiredCoupons as $expiredCoupon){
                $this->manager->remove($expiredCoupon);
            }

            $io->info("EXPIRED COUPONS DELETED.");
        }
        else $io->info("NO EXPIRED COUPONS HAS BEEN FOUND.");

        if(count($expiredPromos) > 0){
            foreach ($expiredPromos as $expiredPromo){
                $this->manager->remove($expiredPromo);
            }

            $io->info("EXPIRED PROMOTIONS DELETED.");
        }else $io->info("NO EXPIRED PROMOTIONS HAS BEEN FOUND.");

        $this->manager->flush();

        $io->success('OK DONE.');

        return Command::SUCCESS;
    }
}
