import React, {useState} from 'react';
import {useUser} from "@/contexts/UserContext";
import DeleteModal from "@/components/DeleteModal";

function Review(props) {

    const {id, experience, rate, client, createdAt, updatedAt, snapImage} = props.review;

    const {user} = useUser();

    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if(i <= rate){
            stars.push(
                <svg className="block h-6 w-6 align-middle text-yellow-500"
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        className=""></path>
                </svg>
            )
        }
        else{
            stars.push(
                <svg className="block h-6 w-6 align-middle text-yellow-500"
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        className=""></path>
                </svg>
            )
        }
    }

    return (
        <>
            <ul>
                <li className="py-8 text-left border px-4 m-2">
                    <div className="flex items-start">
                        <img className="block h-10 w-10 max-w-full flex-shrink-0 rounded-full align-middle"
                             src={client && client.profilePicture ? client.profilePicture : "/placeholders/customer.png"}
                             alt={client && client.profilePicture ? `profile-${client.id}`: "placeholder"}/>

                        <div className="ml-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">{stars}</div>
                                {
                                    client.id === user.id
                                    &&
                                    <div>
                                        <div>
                                            <DeleteModal context={"review"} rid={id} prodId={props.prodId}/>
                                        </div>
                                    </div>

                                }
                            </div>
                            <p className="mt-5 text-base text-gray-900 dark:text-white">
                                {experience}
                            </p>
                            {
                                snapImage
                                &&
                                <div className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border border-gray-900 text-center">
                                    <a href={snapImage} target={"_blank"}>
                                        <img className="h-full w-full object-cover"
                                             src={snapImage} alt={`snap-image-${id}`}/>
                                    </a>
                                </div>
                            }
                            <p className="mt-5 text-sm font-bold text-gray-900 dark:text-teal-200">{client.username}</p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-teal-100">{new Date(createdAt).toLocaleString()}</p>
                            {updatedAt && <p className="mt-1 text-sm text-gray-600 dark:text-teal-100">{new Date(updatedAt).toLocaleString()}</p>}
                        </div>
                    </div>
                </li>
            </ul>
        </>
    );
}

export default Review;