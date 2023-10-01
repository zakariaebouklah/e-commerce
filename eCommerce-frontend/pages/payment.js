import Head from 'next/head';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

function PaymentPage() {

    const {t} = useTranslation("common")

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <Head>
                <title>Payment - HerboLAB</title>
            </Head>
            <main className="pt-24">
                <h1 className="text-3xl font-semibold mb-4">{t('payment_page_title')}</h1>
                <p className="text-gray-700 mb-2">{t('welcome_message')}</p>
                <p className="mb-2">{t('pay_in_cash')}</p>
                <p className="mb-2">{t('exact_amount')}</p>
                <p className="mb-2">{t('receipt_provided')}</p>
                <p className="mb-2">{t('be_available')}</p>
                <p className="mb-2">{t('contact_support')}</p>
            </main>
        </div>
    );
}

export async function getStaticProps({ locale }) {

    console.log("getStaticProps locale : ", locale)
    const fs = require('fs');

    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"]))
        },
    };
}

export default PaymentPage;
