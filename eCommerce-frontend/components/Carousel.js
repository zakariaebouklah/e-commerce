import React, {useState} from 'react';
import {useUser} from "@/contexts/UserContext";
import {useRouter} from "next/router";

function Carousel(props) {

    const {user} = useUser();

    const router = useRouter();
    const {locale} = router

    const [currentIndex, setCurrentIndex] = useState(0);

    let pictures = [];
    let videos = [];

    if(props.context === "showcase"){
        pictures = props.bannersData.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).filter((banner) => (
                (banner.bannerFile.endsWith("png")
                    || banner.bannerFile.endsWith("jpg")
                    || banner.bannerFile.endsWith("jpeg"))

                &&

                (!banner.product && !banner.subCategory)

            )
        )

        videos = props.bannersData.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).filter((banner) => (
                (banner.bannerFile.endsWith("mp4")
                    || banner.bannerFile.endsWith("mov")
                    || banner.bannerFile.endsWith("flv"))

                &&

                (!banner.product && !banner.subCategory)

            )
        )
    }
    else{
        pictures = props.bannersData.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).filter((banner) => (
                (banner.bannerFile.endsWith("png")
                    || banner.bannerFile.endsWith("jpg")
                    || banner.bannerFile.endsWith("jpeg"))

                &&

                (banner.product || banner.subCategory)

            )
        )

        videos = props.bannersData.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).filter((banner) => (
                (banner.bannerFile.endsWith("mp4")
                    || banner.bannerFile.endsWith("mov")
                    || banner.bannerFile.endsWith("flv"))

                &&

                (banner.product || banner.subCategory)

            )
        )
    }

    const handlePrevClick = () => {
        console.log("prev")
        if (currentIndex === 0) {
            setCurrentIndex(videos.concat(pictures).length - 1); // Go to the last element
        } else {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNextClick = () => {
        console.log("next")
        if (currentIndex === videos.concat(pictures).length - 1) {
            setCurrentIndex(0); // Go to the first element
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <>
            <div id="default-carousel" className="relative sm:pt-14 w-full lg:h-screen" data-carousel="slide">
                 {/*Carousel wrapper */}
                <div className="transition-all relative h-[270px] md:h-[500px] lg:h-screen overflow-hidden rounded-lg">
                     {/*Items */}
                    {
                        videos.map((video, index) => (
                            <div key={index} className={currentIndex === index ? "duration-700 ease-in-out lg:h-screen" : "hidden"}>
                                <a href={
                                    video.product
                                        ?
                                        `/${locale}/product/${video.product.id}`
                                        :
                                            video.subCategory
                                                ?
                                                `/${locale}/sub-category/${video.subCategory.id}`
                                                :
                                                `#`
                                }>
                                    <video autoPlay className="absolute top-0 left-0 min-w-full min-h-full h-max" muted loop
                                           controlsList="nodownload">
                                        <source src={video.bannerFile} about={index}/>
                                    </video>
                                </a>

                            </div>
                        ))
                    }
                    {
                        pictures.map((pic, index) => (
                            <div key={index} className={currentIndex === (index + videos.length) ? "duration-700 ease-in-out lg:h-screen" : "hidden"}>
                                <a href={
                                    pic.product
                                        ?
                                        `/${locale}/product/${pic.product.id}`
                                        :
                                        pic.subCategory
                                            ?
                                            `/${locale}/sub-category/${pic.subCategory.id}`
                                            :
                                            `#`
                                }>
                                    <img src={pic.bannerFile}
                                         className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                                         alt={"banner " + index}/>
                                </a>
                            </div>
                        ))
                    }
                </div>
                 {/*Slider indicators */}
                <div className="absolute flex space-x-3 items-center -translate-x-1/2 bottom-12 lg:bottom-5 left-1/2">
                    {
                        videos.concat(pictures).map((banner, index) => (
                            <button key={index} type="button" className={`w-1.5 h-1.5 lg:w-3 lg:h-3 rounded-full ${index === currentIndex ? "bg-green-700" : "bg-green-300"}`}
                                    aria-current="true" aria-label={"Slide " + (index+1)}
                                    onClick={() => setCurrentIndex(index)}
                            ></button>
                        ))
                    }
                    {
                        user !== undefined && user?.roles?.includes("ROLE_ADMIN")
                        &&
                        <button onClick={() => router.push("/tsukingo/assets/banners/new", "/tsukingo/assets/banners/new", {locale})} className={`group w-5 h-5 lg:w-6 lg:h-5 rounded-full effect hover:rounded-md hover:w-20 hover:h-10 bg-ble flex justify-start items-center`}
                                aria-current="true">
                            <div className="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </div>
                            <span className="text-white opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-75 delay-75 ease-in">Add</span>
                        </button>
                    }
                </div>
                 {/*Slider controls */}
                <button type="button"
                        className="absolute top-0 left-0 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                        onClick={handlePrevClick}>
                    <span
                        className="inline-flex items-center justify-center w-5 lg:w-10 h-5 lg:h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg className="w-2 h-2 lg:w-4 lg:h-4 text-dark dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M5 1 1 5l4 4"/>
                        </svg>
                        <span className="sr-only">Previous</span>
                    </span>
                </button>
                <button type="button"
                        className="absolute top-0 right-0 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                        onClick={handleNextClick}>
                    <span
                        className="inline-flex items-center justify-center w-5 lg:w-10 h-5 lg:h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg className="w-2 h-2 lg:w-4 lg:h-4 text-dark dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m1 9 4-4-4-4"/>
                        </svg>
                        <span className="sr-only">Next</span>
                    </span>
                </button>
            </div>
        </>
    );
}

export default Carousel;