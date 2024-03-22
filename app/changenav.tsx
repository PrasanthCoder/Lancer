"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
  url: string;
  userid: string;
}
export function NavigationEvents(props: Props) {
  const pathname = usePathname();
  const sellerurl = `/dashboard/${props.userid}`;
  const gigsurl = `/dashboard/${props.userid}/gigs`;
  const ordersurl = `/dashboard/${props.userid}/orders`;
  const profileurl = `/dashboard/${props.userid}/profile`;
  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith(sellerurl)) {
      return (
        <div className="inline">
          <Link
            href={profileurl}
            prefetch={false}
            className="px-2 mx-2 py-1 text-md"
          >
            Profile
          </Link>
          <Link
            href={gigsurl}
            prefetch={false}
            className="px-2 mx-2 py-1 text-md"
          >
            Gigs
          </Link>
          <Link
            href={ordersurl}
            prefetch={false}
            className="px-2 mx-2 py-1 text-md"
          >
            Orders
          </Link>
          <Link
            href="/dashboard"
            prefetch={false}
            className="px-2 mx-2 py-1 text-md"
          >
            Switch to buying
          </Link>
        </div>
      );
    } else {
      return (
        <Link href={props.url} className="px-10 py-1 text-md">
          Switch to Selling
        </Link>
      );
    }
  };

  return getPageTitle(pathname);
}
