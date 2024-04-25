import { UserCircleIcon } from "@heroicons/react/24/solid";
import { headers } from "next/headers";
import Image from "next/image";
import dbconnect from "@/lib/bdconnect";
import Gig from "@/models/Gig";
import Profile from "@/models/Profile";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";

async function getGig(gigid: string) {
  const res = await fetch(`http://localhost:3000/api/gigs?gigid=${gigid}`, {
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

export default async function Page({
  searchParams,
}: {
  searchParams: { gigid: string };
}) {
  const gig = searchParams.gigid ? await getGig(searchParams.gigid) : {};

  async function editGigAction(formData: FormData) {
    "use server";

    const session = await getSession();
    const details = JSON.parse(JSON.stringify(session, null, 2));
    const profile = await Profile.findOne({ user: details.user.id });

    const image: File | null = formData.get("thumbnail") as unknown as File;
    if (!File) {
      throw new Error("no file uploaded");
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const gigData = {
      name: formData.get("gigname"),
      provider: profile._id,
      description: formData.get("description"),
      category: formData.get("category"),
      minprice: formData.get("min-price"),
      thumbnail: bytes.byteLength ? buffer : gig.thumbnail,
    };
    await dbconnect();

    if (gig._id) {
      Gig.findOneAndUpdate(
        { _id: gig._id }, // Filter criteria
        gigData, // Update data
        { new: true } // To return the updated document
      )
        .then((updatedDocument) => {
          if (updatedDocument) {
            console.log("gig updated successfully:");
          } else {
            console.log("Document not found");
          }
        })
        .catch((error) => {
          console.error("Error updating document:", error);
        });
    } else {
      const newgig = new Gig(gigData);
      await newgig.save();
      Gig.findByIdAndUpdate(
        { _id: newgig._id },
        { thumbnail: bytes.byteLength ? buffer : newgig.thumbnail },
        { new: true }
      ) .then((updatedDocument) => {
        if (updatedDocument) {
          console.log("gig updated successfully:");
        } else {
          console.log("Document not found");
        }
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });;
    }
    redirect("./gigs");
  }

  return (
    <form action={editGigAction}>
      <div className="space-y-12 mt-6 w-4/5 m-auto">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {searchParams.gigid? "Edit your Gig" : "Enter your Gig details!"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="gigname"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name of the Gig
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md">
                  <input
                    type="text"
                    name="gigname"
                    defaultValue={gig.name}
                    id="gigname"
                    autoComplete="gigname"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="I provide service"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  defaultValue={gig.description}
                  placeholder="Tell about your gig and the services you offer in this gig."
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Write a few sentences about your gig.
              </p>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="thumbnail"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Thumbnail
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                {gig.thumbnail ? (
                  <Image
                    src={`data:image/jpeg;base64,${gig.thumbnail}`}
                    width={80}
                    height={80}
                    alt="Thumbnail of the gig"
                    className="rounded-full"
                  />
                ) : (
                  <UserCircleIcon
                    className="h-20 w-20 text-gray-300"
                    aria-hidden="true"
                  />
                )}

                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    name="thumbnail"
                  ></input>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Other Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Use a suitable category so that you can be found easily.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="category"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Category
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="category"
                  id="category"
                  defaultValue={gig.category}
                  autoComplete="given-category"
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="min-price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Minimum Price for the Serivice
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="min-price"
                  id="min-price"
                  autoComplete="min-price"
                  defaultValue={gig.minprice}
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 w-4/5 m-auto flex items-center justify-start gap-x-6">
        <Link
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          href="./gigs"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
