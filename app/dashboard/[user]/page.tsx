import { getSession } from "@/lib/auth";
import { headers } from "next/headers";

async function getProfile() {
  const res = await fetch("http://localhost:3000/api/profiles", {
    cache: "no-store",
    method: "GET",
    headers: headers(),
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch profile");
  }

  return res.json();
}

export default async function Page({ params }: { params: { user: string } }) {
  const profile = await getProfile();
  const session = await getSession();
  const details = JSON.parse(JSON.stringify(session, null, 2));
  const userid = details.user.id;
  if(userid === params.user){
    return (
      <div className="m-5">
        <p>Welcome! {profile.user.fullname}</p>
        <p>Here is your rating - {profile.rating? profile.rating : "Not yet drated"}</p>
  
      </div>
    );
  } else {
    return (
      <h1 className="text-lg font-bold">You are unauthorized to access this page.</h1>
    )
  }
  
}
