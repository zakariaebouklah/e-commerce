import {Fragment, useEffect, useState} from 'react'
import {Dialog, Disclosure, Menu, Transition} from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon} from '@heroicons/react/20/solid'
import axios from "axios";
import Card from "@/components/Card";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Filter(props) {

    const {t} = useTranslation("common")

    const configData = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const sortOptions = props.context ===  "shop" ? [
        { name: t('most_popular'), href: '#', current: false},
        { name: t('best_rating'), href: '#', current: false },
        { name: t('newest'), href: '#', current: false },
        { name: t('price_low_to_high'), href: '#', current: false },
        { name: t('price_high_to_low'), href: '#', current: false },
    ]
        :
        [
            { name: t('most_popular'), href: '#', current: false},
            { name: t('best_rating'), href: '#', current: false },
            { name: t('price_low_to_high'), href: '#', current: false },
            { name: t('price_high_to_low'), href: '#', current: false },
        ]

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

    const [filters, setFilters] = useState([])
    const [permanentFilters, setPermanentFilters] = useState([])

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const [selectedFilters, setSelectedFilters] = useState({});
    const [selectedSorts, setSelectedSorts] = useState({});

    console.log(selectedFilters)
    console.log(selectedSorts)

    useEffect(() => {
        console.log("1")
        axios.get('/api/categories', configData)
            .then((r) => {

                setCategories(r.data)

                const categoriesData = r.data.map((c, index) => ({
                    value: c.name,
                    label: c.name.toLocaleUpperCase(),
                    id: index,
                }));

                // Update filters state by preserving previous data
                setFilters((prevFilters) => [
                    ...prevFilters,
                    {
                        id: 'category',
                        name: t('category'),
                        options: categoriesData,
                    },
                ]);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }, []);

    useEffect(() => {
        console.log("2")
        axios.get('/api/sub-category/all', configData)
            .then((r) => {
                setSubCategories(r.data)

                const subCategoriesData = r.data.map((c, index) => ({
                    value: c.name,
                    label: c.name.toLocaleUpperCase(),
                    id: index,
                }));

                // Update filters state by preserving previous data
                setFilters((prevFilters) => [
                    ...prevFilters,
                    {
                        id: 'sub-category',
                        name: t('sub_category'),
                        options: subCategoriesData,
                    },
                ]);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }, []);

    useEffect(() => {
        setPermanentFilters(() => {
            const key = 'id';

            return [...new Map(filters.map(item =>
                [item[key], item])).values()]
        })
    }, [filters])

    function getCategoryAndSubCategoryForAllProducts(data) {
        const productsWithCategories = [];

        data.forEach((category) => {
            const categoryName = category.name;

            category.subCategories.forEach((subCategory) => {
                const subCategoryName = subCategory.name;

                subCategory.products.forEach((product) => {
                    productsWithCategories.push({
                        ...product,
                        category: categoryName,
                        subCategory: subCategoryName,
                    });
                });
            });
        });

        return productsWithCategories;
    }

// Usage:
    const productsWithCategories = getCategoryAndSubCategoryForAllProducts(categories);

    return (
        <div className="bg-white dark:bg-dark">
            <div>
                {/* Mobile filter dialog */}
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-dark py-4 pb-12 shadow-xl">
                                    <div className="flex items-center justify-between px-4">
                                        <h2 className="text-lg font-medium text-gray-900 dark:text-gan/75">{t('filters')}</h2>
                                        <button
                                            type="button"
                                            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white dark:bg-dark p-2 text-gray-400"
                                            onClick={() => setMobileFiltersOpen(false)}
                                        >
                                            <span className="sr-only">Close menu</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    {/* Filters */}
                                    {
                                        props.context !== "category" && props.context !== "sub-category"
                                        &&
                                        <form className="mt-4 border-t border-gray-200">
                                            {permanentFilters.map((section) => (
                                                <Disclosure as="div" key={section.id} className="border-b px-2 border-gray-200 py-6">
                                                    {({ open }) => (
                                                        <>
                                                            <h3 className="-my-3 flow-root">
                                                                <Disclosure.Button className="flex w-full items-center justify-between bg-white dark:bg-dark py-3 text-sm text-gray-400 hover:text-gray-500">
                                                                    <span className="font-medium text-gray-900 dark:text-gan/75">{section.name}</span>
                                                                    <span className="ml-6 flex items-center">
                                                                    {open ? (
                                                                        <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                                    ) : (
                                                                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                                    )}
                                                                </span>
                                                                </Disclosure.Button>
                                                            </h3>
                                                            <Disclosure.Panel className="pt-6">
                                                                <div className="space-y-4">
                                                                    {section.options.map((option, optionIdx) => (
                                                                        <div key={option.value} className="flex items-center">
                                                                            <input
                                                                                id={`filter-${section.id}-${optionIdx}`}
                                                                                name={`${section.id}[]`}
                                                                                defaultValue={option.value}
                                                                                type="checkbox"
                                                                                checked={selectedFilters[option.value]}
                                                                                onChange={(e) =>
                                                                                    setSelectedFilters((prevFilters) => ({
                                                                                        ...prevFilters,
                                                                                        [option.value]: e.target.checked,
                                                                                    }))
                                                                                }
                                                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                            />
                                                                            <label
                                                                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                                className="ml-3 text-sm text-gray-600 dark:text-gan/50"
                                                                            >
                                                                                {option.label}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </Disclosure.Panel>
                                                        </>
                                                    )}
                                                </Disclosure>
                                            ))}
                                        </form>
                                    }

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gan/75">{props.context === "shop" ? t('shop_products') :
                            props.context === "newest" ? t('new_arrivals') : t('products')
                        }</h1>

                        <div className="flex items-center">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gan/75">
                                        {t('sort')}
                                        <ChevronDownIcon
                                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white dark:bg-dark shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-5 px-2 flex flex-col">
                                            {sortOptions.map((option, index) => (
                                                <Menu.Item key={index}>
                                                    <div className="flex items-center space-x-3">
                                                        <input
                                                            id={`sort-${index}`}
                                                            name={option.name}
                                                            defaultValue={option.name}
                                                            type="radio"
                                                            checked={selectedSorts[option.name]}
                                                            onChange={(e) =>
                                                                setSelectedSorts(() => ({
                                                                    [option.name]: e.target.checked,
                                                                }))
                                                            }
                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <label>{option.name}</label>
                                                    </div>
                                                </Menu.Item>
                                            ))}
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>

                            <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                                <span className="sr-only">View grid</span>
                                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                                onClick={() => setMobileFiltersOpen(true)}
                            >
                                <span className="sr-only">Filters</span>
                                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pb-24 pt-6">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                            {/* Filters */}
                            {
                                props.context !== "category" && props.context !== "sub-category"
                                &&
                                <form className="hidden lg:block">

                                    {permanentFilters.map((section) => (
                                        <Disclosure as="div" key={section.id} className="border-b px-2 border-gray-200 py-6">
                                            {({ open }) => (
                                                <>
                                                    <h3 className="-my-3 flow-root">
                                                        <Disclosure.Button className="flex w-full items-center justify-between bg-white dark:bg-dark py-3 text-sm text-gray-400 hover:text-gray-500">
                                                            <span className="font-medium text-gray-900 dark:text-gan/75">{section.name}</span>
                                                            <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                            ) : (
                                                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                            )}
                                                        </span>
                                                        </Disclosure.Button>
                                                    </h3>
                                                    <Disclosure.Panel className="pt-6">
                                                        <div className="space-y-4">
                                                            {section.options.map((option, optionIdx) => (
                                                                <div key={option.value} className="flex items-center">
                                                                    <input
                                                                        id={`filter-${section.id}-${optionIdx}`}
                                                                        name={`${section.id}[]`}
                                                                        defaultValue={option.value}
                                                                        type="checkbox"
                                                                        checked={selectedFilters[option.value]}
                                                                        onChange={(e) =>
                                                                            setSelectedFilters((prevFilters) => ({
                                                                                ...prevFilters,
                                                                                [option.value]: e.target.checked,
                                                                            }))
                                                                        }
                                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                    />
                                                                    <label
                                                                        htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                        className="ml-3 text-sm text-gray-600 dark:text-gan/50"
                                                                    >
                                                                        {option.label}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    ))}
                                </form>
                            }

                            {/* Product grid */}
                            <div className="lg:col-span-3">
                                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 justify-evenly justify-items-center">
                                    {
                                        props.context === "shop"
                                        &&
                                        productsWithCategories
                                            .filter((p) => {
                                                let theFilters = Object.keys(selectedFilters).filter((f) => selectedFilters[f])

                                                if(theFilters.length === 0) return p;
                                                else {
                                                    return theFilters.includes(p.category) || theFilters.includes(p.subCategory)
                                                }

                                            })
                                            .sort((a,b) => {

                                                    let theSorts = Object.keys(selectedSorts).find((f) => selectedSorts[f])

                                                switch (theSorts) {
                                                    case t('most_popular'):
                                                        // Compare products by rating (you'll need to access the rating property of your products)
                                                        return b.reviews.length - a.reviews.length;
                                                    case t('best_rating'):
                                                        // Compare products by rating (you'll need to access the rating property of your products)
                                                        return b.ratingAvg - a.ratingAvg;
                                                    case t('newest'):
                                                        // Compare products by release date (you'll need to access the releasedAt property of your products)
                                                        return new Date(b.releasedAt) - new Date(a.releasedAt);
                                                    case t('price_low_to_high'):
                                                        // Compare products by price (you'll need to access the price property of your products)
                                                        return a.price - b.price;
                                                    case t('price_high_to_low'):
                                                        // Compare products by price (you'll need to access the price property of your products)
                                                        return b.price - a.price;
                                                    default:
                                                        // Default to 'Most Popular' or any other sorting logic
                                                        // For example, you can compare products by popularity or some other criteria
                                                        return 0;
                                                }
                                            })
                                            .map((p, index) => (
                                            <Card key={index} product={p}/>
                                        ))
                                    }
                                    {
                                        props.context === "newest"
                                        &&
                                        productsWithCategories
                                            .sort((a,b) => {return new Date(b.releasedAt) - new Date(a.releasedAt);})
                                            .slice(0,20)
                                            .filter((p) => {
                                                let theFilters = Object.keys(selectedFilters).filter((f) => selectedFilters[f])

                                                if(theFilters.length === 0) return p;
                                                else {
                                                    return theFilters.includes(p.category) || theFilters.includes(p.subCategory)
                                                }

                                            })
                                            .sort((a,b) => {

                                                let theSorts = Object.keys(selectedSorts).find((f) => selectedSorts[f])

                                                switch (theSorts) {
                                                    case t('most_popular'):
                                                        // Compare products by rating (you'll need to access the rating property of your products)
                                                        return b.reviews.length - a.reviews.length;
                                                    case t('best_rating'):
                                                        // Compare products by rating (you'll need to access the rating property of your products)
                                                        return b.ratingAvg - a.ratingAvg;
                                                    case t('price_low_to_high'):
                                                        // Compare products by price (you'll need to access the price property of your products)
                                                        return a.price - b.price;
                                                    case t('price_high_to_low'):
                                                        // Compare products by price (you'll need to access the price property of your products)
                                                        return b.price - a.price;
                                                    default:
                                                        // Default to 'Most Popular' or any other sorting logic
                                                        // For example, you can compare products by popularity or some other criteria
                                                        return 0;
                                                }
                                            })
                                            .map((p, index) => (
                                                <Card key={index} product={p}/>
                                            ))
                                    }
                                    {
                                        props.context === "category"
                                        &&
                                        productsWithCategories
                                            .filter((p) => {
                                                const category = categories.find((c) => parseInt(props.cid) === c.id)

                                                console.log(typeof props.cid)

                                                return p.category === category.name
                                            })
                                            .sort((a,b) => {

                                                let theSorts = Object.keys(selectedSorts).find((f) => selectedSorts[f])

                                                switch (theSorts) {
                                                    case t('most_popular'):
                                                        // Compare products by rating (you'll need to access the rating property of your products)
                                                        return b.reviews.length - a.reviews.length;
                                                    case t('best_rating'):
                                                        // Compare products by rating (you'll need to access the rating property of your products)
                                                        return b.ratingAvg - a.ratingAvg;
                                                    case t('newest'):
                                                        // Compare products by release date (you'll need to access the releasedAt property of your products)
                                                        return new Date(b.releasedAt) - new Date(a.releasedAt);
                                                    case t('price_low_to_high'):
                                                        // Compare products by price (you'll need to access the price property of your products)
                                                        return a.price - b.price;
                                                    case t('price_high_to_low'):
                                                        // Compare products by price (you'll need to access the price property of your products)
                                                        return b.price - a.price;
                                                    default:
                                                        // Default to 'Most Popular' or any other sorting logic
                                                        // For example, you can compare products by popularity or some other criteria
                                                        return 0;
                                                }
                                            })
                                            .map((p, index) => (
                                                <Card key={index} product={p}/>
                                            ))
                                    }
                                    {
                                        props.context === "sub-category"
                                        &&
                                        productsWithCategories
                                            .filter((p) => {
                                                const subCategory = subCategories.find((s) => parseInt(props.sid) === s.id)

                                                console.log(typeof props.sid)

                                                return p.subCategory === subCategory?.name
                                            })
                                            .sort((a,b) => {

                                                let theSorts = Object.keys(selectedSorts).find((f) => selectedSorts[f])

                                                switch (theSorts) {
                                                    case t('most_popular'):
                                                        // Compare products by rating (you'll need to access the rating property of your products)
                                                        return b.reviews.length - a.reviews.length;
                                                    case t('best_rating'):
                                                        // Compare products by rating (you'll need to access the rating property of your products)
                                                        return b.ratingAvg - a.ratingAvg;
                                                    case t('newest'):
                                                        // Compare products by release date (you'll need to access the releasedAt property of your products)
                                                        return new Date(b.releasedAt) - new Date(a.releasedAt);
                                                    case t('price_low_to_high'):
                                                        // Compare products by price (you'll need to access the price property of your products)
                                                        return a.price - b.price;
                                                    case t('price_high_to_low'):
                                                        // Compare products by price (you'll need to access the price property of your products)
                                                        return b.price - a.price;
                                                    default:
                                                        // Default to 'Most Popular' or any other sorting logic
                                                        // For example, you can compare products by popularity or some other criteria
                                                        return 0;
                                                }
                                            })
                                            .map((p, index) => (
                                                <Card key={index} product={p}/>
                                            ))
                                    }
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
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
