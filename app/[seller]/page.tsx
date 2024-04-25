import { headers } from "next/headers";
import { ProfileShow } from "./profileshow";
import {MyGigs} from "./mygigs";

async function getProfile(username: string) {
  const res = await fetch(
    `http://localhost:3000/api/profiles?username=${username}`,
    {
      cache: "no-store",
      method: "GET",
      headers: headers(),
    }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch profile");
  }

  return res.json();
}


export default async function Page({ params }: { params: { seller: string } }) {
  const profile = await getProfile(params.seller);
  return (
    <div>
      <ProfileShow
        profilepic={profile.profilepic}
        fullname={profile.user.fullname}
        username={profile.user.username}
        description={profile.description}
        country={profile.country}
        state={profile.state}
        city={profile.city}
      />
      <div className="m-10">
        <p className="text-xl font-bold text-center"> My Gigs</p>
        <MyGigs userid={profile.user._id}/>
      </div>
    </div>
  );
}
