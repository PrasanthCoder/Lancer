import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import { headers } from "next/headers";
import { GigsPopulate } from "@/models/Gig";
import Link from "next/link";
import { Users } from "@/models/User";

async function getGigs(userid: string) {
  const res = await fetch(`http://127.0.0.1:3000/api/gigs?id=${userid}`, {
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

export async function MyGigs(props: { userid: string }) {
  const gigs = await getGigs(props.userid);
  const profiles: Array<Users> = [];
  gigs.forEach((gig: GigsPopulate) => {
    profiles.push(gig.provider.user as Users);
  });
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {gigs.map((gig: GigsPopulate, index: number) => (
          <div key={gig._id}>
              <div className="px-8 py-12">
              <Link href={`./${profiles[index].username}/${gig.name.replace(/\s/g, '-')}`}>
                <div className="mx-auto">
                  <Image
                    width={500}
                    height={500}
                    className="w-full h-60 rounded-lg mx-auto"
                    src={`data:image/jpeg;base64,${gig.thumbnail}`}
                    alt="This is a gig image"
                  />
                </div>
                <blockquote className="">
                  <p className="text-lg my-2 text-black font-medium">
                    {gig.name}
                  </p>
                </blockquote>
                </Link>
                <Link href={`./${profiles[index].username}`}>
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
                    <p className="text-base text-gray-600">
                      {profiles[index].fullname}
                    </p>
                  </div>
                </div>
                </Link>
              </div>

          </div>
        ))}
      </div>
    </div>
  );
}
