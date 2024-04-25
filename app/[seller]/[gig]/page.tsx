import { UserCircleIcon } from "@heroicons/react/16/solid";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

async function getGig(gigname: string) {
  const res = await fetch(`http://localhost:3000/api/gigs?name=${gigname}`, {
    cache: "no-store",
    method: "GET",
    headers: headers(),
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page({ params }: { params: { gig: string } }) {
  console.log("This is params of gigname ", params.gig);
  const gig = await getGig(params.gig);
  const profile = gig.provider;
  console.log(profile);
  return (
    <div className="flex w-4/5 m-auto">
      <div className="px-8 py-12">
        <p className="text-2xl mb-5 font-bold text-gray-600 ">{gig.name}</p>
        <div className="flex">
          {gig.provider.profilepic ? (
            <Image
              src={`data:image/jpeg;base64,${gig.provider.profilepic}`}
              width={80}
              height={80}
              alt="Profile Picture"
              className="w-12 h-12 rounded-full my-auto"
            />
          ) : (
            <UserCircleIcon
              className="w-12 h-12 text-gray-300 my-auto"
              aria-hidden="true"
            />
          )}
          <div className="my-auto mx-5">
            <p className="text-base text-gray-600">{profile.user.fullname}</p>
          </div>
        </div>
        <div className="mx-auto">
          <Image
            width={700}
            height={200}
            className="rounded-lg my-5"
            src={`data:image/jpeg;base64,${gig.thumbnail}`}
            alt="This is a gig image"
          />
        </div>
        <p className="text-2xl mb-5 font-bold text-gray-700 ">About my gig</p>
        <p className="text-base mb-5 font-normal text-black ">
          {gig.description}
        </p>
      </div>

      <div className="mx-8 my-12 flex-1 realtive">
        <div className="p-6 border-2 sticky top-5">
          <p className="text-xl mb-5 font-bold text-gray-700 text-center ">
            Service price
          </p>
          <p className="text-xl mb-5 font-bold text-black text-center ">
            ${gig.minprice}
          </p>
          <div className="flex justify-center">
            <Link
              className="middle none center rounded-lg bg-green-500 py-3 px-6 font-sans text-base font-normal text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              data-ripple-light="true"
              href={`./${gig.name.replace(/\s/g, '-')}/order`}
            >
              Continue
            </Link>

            <link
              rel="stylesheet"
              href="https://unpkg.com/@material-tailwind/html@latest/styles/material-tailwind.css"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
