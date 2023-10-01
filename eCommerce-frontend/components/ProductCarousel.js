import React, { useState } from "react";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";

function ProductCarousel(props) {

    const router = useRouter();
    const {locale} = router

    const {t} = useTranslation("common")

    return (
        <div className="container mx-auto">
            <div className="flex items-center justify-center w-full h-full py-24 sm:py-8 px-4">
                {/* Carousel for desktop and large size devices */}
                <CarouselProvider className="lg:block hidden" naturalSlideWidth={100} isIntrinsicHeight={true} totalSlides={props.items.length} visibleSlides={4} step={1} infinite={true}>
                    <div className="w-full relative flex items-center justify-center">
                        <ButtonBack role="button" aria-label="slide backward" className="absolute z-10 left-0 ml-8 hover:bg-dark effect p-7 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer" id="prev">
                            <svg width={8} height={14} viewBox="0 0 8 14" fill="none" className="text-grn" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </ButtonBack>
                        <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden">
                            <Slider>
                                <div id="slider" className="h-full flex lg:gap-8 md:gap-6 gap-14 items-center justify-start transition ease-out duration-700">
                                    {
                                        props.context === "on-promos"
                                        &&
                                        props.items.filter((i) => i.discountPrice).map((item, index) => {
                                            const percentage = ((item.price - item.discountPrice)/item.price)*100;
                                            return <Slide index={index} key={index}>
                                                <div onClick={() => router.push(`/product/${item.id}`, `/product/${item.id}`, {locale})}>
                                                    <div className="flex flex-shrink-0 relative w-full h-full sm:w-auto">
                                                        {
                                                            item.images.length !== 0 ?
                                                                <img className="object-cover object-center h-full w-full"
                                                                     src={item.images[0]?.image}
                                                                     alt="product image"/>
                                                                :
                                                                <img className="object-cover object-center h-full w-full"
                                                                     src="/placeholders/no-img-placeholder.jpg"
                                                                     alt="product placeholder"/>
                                                        }
                                                        <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                                                            <span className="absolute top-0 left-0 m-2 rounded-full bg-org px-2 text-center text-sm font-bold hover:text-grn effect text-gan">{Math.round(percentage * 10)/10}% {t('off')}</span>
                                                            <div className="flex h-full items-end pb-6">
                                                                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">{item.name}</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Slide>
                                        })
                                    }
                                    {
                                        props.context === "popular"
                                        &&
                                        props.items.filter((i) => i.ratingAvg >= 3).map((item, index) => {
                                            const percentage = ((item.price - item.discountPrice)/item.price)*100;
                                            return <Slide index={index} key={index}>
                                                <div onClick={() => router.push(`/product/${item.id}`, `/product/${item.id}`, {locale})}>
                                                    <div className="flex flex-shrink-0 relative w-full h-full sm:w-auto">
                                                        {
                                                            item.images.length !== 0 ?
                                                                <img className="object-cover object-center h-full w-full"
                                                                     src={item.images[0]?.image}
                                                                     alt="product image"/>
                                                                :
                                                                <img className="object-cover object-center h-full w-full"
                                                                     src="/placeholders/no-img-placeholder.jpg"
                                                                     alt="product placeholder"/>
                                                        }
                                                        <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                                                            {
                                                                item.discountPrice
                                                                &&
                                                                <span className="absolute top-0 left-0 m-2 rounded-full bg-org px-2 text-center text-sm font-bold hover:text-grn effect text-gan">
                                                                    {Math.round(percentage * 10)/10}% {t('off')}
                                                                </span>
                                                            }
                                                            <div className="flex h-full items-end pb-6">
                                                                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">{item.name}</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Slide>
                                        })
                                    }
                                    {
                                        props.context === "newest"
                                        &&
                                        props.items
                                            .sort((a,b) => {return new Date(b.releasedAt) - new Date(a.releasedAt);})
                                            .slice(0,6)
                                            .map((item, index) => {
                                            const percentage = ((item.price - item.discountPrice)/item.price)*100;
                                            return <Slide index={index} key={index}>
                                                <div onClick={() => router.push(`/product/${item.id}`, `/product/${item.id}`, {locale})}>
                                                    <div className="flex flex-shrink-0 relative w-full h-full sm:w-auto">
                                                        {
                                                            item.images.length !== 0 ?
                                                                <img className="object-cover object-center h-full w-full"
                                                                     src={item.images[0]?.image}
                                                                     alt="product image"/>
                                                                :
                                                                <img className="object-cover object-center h-full w-full"
                                                                     src="/placeholders/no-img-placeholder.jpg"
                                                                     alt="product placeholder"/>
                                                        }
                                                        <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                                                            {
                                                                item.discountPrice
                                                                &&
                                                                <span className="absolute top-0 left-0 m-2 rounded-full bg-org px-2 text-center text-sm font-bold hover:text-grn effect text-gan">
                                                                    {Math.round(percentage * 10)/10}% {t('off')}
                                                                </span>
                                                            }
                                                            <div className="flex h-full items-end pb-6">
                                                                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">{item.name}</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Slide>
                                        })
                                    }
                                </div>
                            </Slider>
                        </div>
                        <ButtonNext role="button" aria-label="slide forward" className="absolute z-10 right-0 mr-8 hover:bg-dark effect p-7 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400" id="next">
                            <svg width={8} height={14} viewBox="0 0 8 14" fill="none" className="text-grn" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </ButtonNext>
                    </div>
                </CarouselProvider>

                {/* Carousel for tablet and medium size devices */}
                <CarouselProvider className="lg:hidden md:block hidden" naturalSlideWidth={100} isIntrinsicHeight={true} totalSlides={props.items.length} visibleSlides={2} step={1} infinite={true}>
                    <div className="w-full relative flex items-center justify-center">
                        <ButtonBack role="button" aria-label="slide backward" className="absolute z-10 left-0 ml-8 hover:bg-dark effect p-7 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer" id="prev">
                            <svg width={8} height={14} viewBox="0 0 8 14" fill="none" className="text-grn" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </ButtonBack>
                        <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden">
                            <Slider>
                                <div id="slider" className="h-full flex lg:gap-8 md:gap-6 gap-14 items-center justify-start transition ease-out duration-700">
                                    {
                                        props.context === "on-promos"
                                        &&
                                        props.items.filter((i) => i.discountPrice).map((item, index) => {
                                            const percentage = ((item.price - item.discountPrice)/item.price)*100;
                                            return <Slide key={index} index={index}>
                                                <div onClick={() => router.push(`/product/${item.id}`, `/product/${item.id}`, {locale})}>
                                                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                                                        {
                                                            item.images.length !== 0 ?
                                                                <img className="object-cover object-center w-full"
                                                                     src={item.images[0]?.image}
                                                                     alt="product image"/>
                                                                :
                                                                <img className="object-cover object-center w-full"
                                                                     src="/placeholders/no-img-placeholder.jpg"
                                                                     alt="product placeholder"/>
                                                        }
                                                        <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                                                            <span className="absolute top-0 left-0 m-2 rounded-full bg-org px-2 text-center text-sm font-medium text-gan">{Math.round(percentage * 10)/10}% {t('off')}</span>
                                                            <div className="flex h-full items-end pb-6">
                                                                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">{item.name}</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Slide>
                                        })
                                    }
                                    {
                                        props.context === "popular"
                                        &&
                                        props.items.filter((i) => i.ratingAvg >= 3).map((item, index) => {
                                            const percentage = ((item.price - item.discountPrice)/item.price)*100;
                                            return <Slide index={index} key={index}>
                                                <div onClick={() => router.push(`/product/${item.id}`, `/product/${item.id}`, {locale})}>
                                                    <div className="flex flex-shrink-0 relative w-full h-full sm:w-auto">
                                                        {
                                                            item.images.length !== 0 ?
                                                                <img className="object-cover object-center h-full w-full"
                                                                     src={item.images[0]?.image}
                                                                     alt="product image"/>
                                                                :
                                                                <img className="object-cover object-center h-full w-full"
                                                                     src="/placeholders/no-img-placeholder.jpg"
                                                                     alt="product placeholder"/>
                                                        }
                                                        <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                                                            {
                                                                item.discountPrice
                                                                &&
                                                                <span className="absolute top-0 left-0 m-2 rounded-full bg-org px-2 text-center text-sm font-bold hover:text-grn effect text-gan">
                                                                    {Math.round(percentage * 10)/10}% {t('off')}
                                                                </span>
                                                            }
                                                            <div className="flex h-full items-end pb-6">
                                                                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">{item.name}</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Slide>
                                        })
                                    }
                                    {
                                        props.context === "newest"
                                        &&
                                        props.items
                                            .sort((a,b) => {return new Date(b.releasedAt) - new Date(a.releasedAt);})
                                            .slice(0,6)
                                            .map((item, index) => {
                                                const percentage = ((item.price - item.discountPrice)/item.price)*100;
                                                return <Slide index={index} key={index}>
                                                    <div onClick={() => router.push(`/product/${item.id}`, `/product/${item.id}`, {locale})}>
                                                        <div className="flex flex-shrink-0 relative w-full h-full sm:w-auto">
                                                            {
                                                                item.images.length !== 0 ?
                                                                    <img className="object-cover object-center h-full w-full"
                                                                         src={item.images[0]?.image}
                                                                         alt="product image"/>
                                                                    :
                                                                    <img className="object-cover object-center h-full w-full"
                                                                         src="/placeholders/no-img-placeholder.jpg"
                                                                         alt="product placeholder"/>
                                                            }
                                                            <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                                                                {
                                                                    item.discountPrice
                                                                    &&
                                                                    <span className="absolute top-0 left-0 m-2 rounded-full bg-org px-2 text-center text-sm font-bold hover:text-grn effect text-gan">
                                                                    {Math.round(percentage * 10)/10}% {t('off')}
                                                                </span>
                                                                }
                                                                <div className="flex h-full items-end pb-6">
                                                                    <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">{item.name}</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Slide>
                                            })
                                    }
                                </div>
                            </Slider>
                        </div>
                        <ButtonNext role="button" aria-label="slide forward" className="absolute z-10 right-0 mr-8 hover:bg-dark effect p-7 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400" id="next">
                            <svg width={8} height={14} viewBox="0 0 8 14" fill="none" className="text-grn" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </ButtonNext>
                    </div>
                </CarouselProvider>

                {/* Carousel for mobile and Small size Devices */}
                <CarouselProvider className="block md:hidden " naturalSlideWidth={100} isIntrinsicHeight={true} totalSlides={props.items.length} visibleSlides={1} step={1} infinite={true}>
                    <div className="w-full relative flex items-center justify-center">
                        <ButtonBack role="button" aria-label="slide backward" className="absolute z-10 left-0 ml-8 hover:bg-dark effect p-7 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer" id="prev">
                            <svg width={8} height={14} viewBox="0 0 8 14" fill="none" className="text-grn" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </ButtonBack>
                        <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden">
                            <Slider>
                                <div id="slider" className="h-full w-full flex lg:gap-8 md:gap-6 items-center justify-start transition ease-out duration-700">
                                    {
                                        props.context === "on-promos"
                                        &&
                                        props.items.filter((i) => i.discountPrice).map((item, index) => {
                                            const percentage = ((item.price - item.discountPrice)/item.price)*100;
                                            return <Slide key={index} index={index}>
                                                <div onClick={() => router.push(`/product/${item.id}`, `/product/${item.id}`, {locale})}>
                                                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                                                        {
                                                            item.images.length !== 0 ?
                                                                <img className="object-cover object-center w-full"
                                                                     src={item.images[0]?.image}
                                                                     alt="product image"/>
                                                                :
                                                                <img className="object-cover object-center w-full"
                                                                     src="/placeholders/no-img-placeholder.jpg"
                                                                     alt="product placeholder"/>
                                                        }
                                                        <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                                                            {
                                                                item.discountPrice
                                                                &&
                                                                <span className="absolute top-0 left-0 m-2 rounded-full bg-org px-2 text-center text-sm font-bold hover:text-grn effect text-gan">
                                                                    {Math.round(percentage * 10)/10}% {t('off')}
                                                                </span>
                                                            }
                                                            <div className="flex h-full items-end pb-6">
                                                                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">{item.name}</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Slide>
                                        })
                                    }
                                    {
                                        props.context === "popular"
                                        &&
                                        props.items.filter((i) => i.ratingAvg >= 3).map((item, index) => {
                                            const percentage = ((item.price - item.discountPrice)/item.price)*100;
                                            return <Slide index={index} key={index}>
                                                <div onClick={() => router.push(`/product/${item.id}`, `/product/${item.id}`, {locale})}>
                                                    <div className="flex flex-shrink-0 relative w-full h-full sm:w-auto">
                                                        {
                                                            item.images.length !== 0 ?
                                                                <img className="object-cover object-center h-full w-full"
                                                                     src={item.images[0]?.image}
                                                                     alt="product image"/>
                                                                :
                                                                <img className="object-cover object-center h-full w-full"
                                                                     src="/placeholders/no-img-placeholder.jpg"
                                                                     alt="product placeholder"/>
                                                        }
                                                        <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                                                            {
                                                                item.discountPrice
                                                                &&
                                                                <span className="absolute top-0 left-0 m-2 rounded-full bg-org px-2 text-center text-sm font-bold hover:text-grn effect text-gan">
                                                                    {Math.round(percentage * 10)/10}% {t('off')}
                                                                </span>
                                                            }
                                                            <div className="flex h-full items-end pb-6">
                                                                <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">{item.name}</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Slide>
                                        })
                                    }
                                    {
                                        props.context === "newest"
                                        &&
                                        props.items
                                            .sort((a,b) => {return new Date(b.releasedAt) - new Date(a.releasedAt);})
                                            .slice(0,6)
                                            .map((item, index) => {
                                                const percentage = ((item.price - item.discountPrice)/item.price)*100;
                                                return <Slide index={index} key={index}>
                                                    <div onClick={() => router.push(`/product/${item.id}`, `/product/${item.id}`, {locale})}>
                                                        <div className="flex flex-shrink-0 relative w-full h-full sm:w-auto">
                                                            {
                                                                item.images.length !== 0 ?
                                                                    <img className="object-cover object-center h-full w-full"
                                                                         src={item.images[0]?.image}
                                                                         alt="product image"/>
                                                                    :
                                                                    <img className="object-cover object-center h-full w-full"
                                                                         src="/placeholders/no-img-placeholder.jpg"
                                                                         alt="product placeholder"/>
                                                            }
                                                            <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                                                                {
                                                                    item.discountPrice
                                                                    &&
                                                                    <span className="absolute top-0 left-0 m-2 rounded-full bg-org px-2 text-center text-sm font-bold hover:text-grn effect text-gan">
                                                                    {Math.round(percentage * 10)/10}% {t('off')}
                                                                </span>
                                                                }
                                                                <div className="flex h-full items-end pb-6">
                                                                    <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">{item.name}</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Slide>
                                            })
                                    }
                                </div>
                            </Slider>
                        </div>
                        <ButtonNext role="button" aria-label="slide forward" className="absolute z-10 right-0 mr-8 hover:bg-dark effect p-7 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400" id="next">
                            <svg width={8} height={14} viewBox="0 0 8 14" fill="none" className="text-grn" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </ButtonNext>
                    </div>
                </CarouselProvider>
            </div>
        </div>
    );
}

export default ProductCarousel;