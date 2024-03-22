'use client'
import { notFound } from "next/navigation";
import Image from "next/image";
import { Gigs } from "@/models/Gig";
import {useState, useEffect} from "react";
import axios from 'axios';
import Link from "next/link";

export default function ShowGig() {
  const [gigs, setGigs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/gigs');
                setGigs(response.data); // Assuming the response data is an array of gigs
            } catch (error) {
                console.error('Error fetching gigs:', error);
            }
        };

        fetchData();
    }, []);
  return (
    <div className="grid grid-cols-3 gap-4">
      
        {gigs.map((gig: Gigs) => (
          <div key={gig._id}>
            <Link href="#">
            <Image
              src={`data:image/jpeg;base64,${gig.thumbnail}`} // Assuming the buffer is encoded as base64
              alt="Thumbnail"
              width={300}
              height={200}
            />
            <h2>{gig.name}</h2>
            <p>{gig.description}</p>
            <p>Starts from ${gig.minprice}</p>
            </Link>
          </div>
        ))}

    </div>
  );
}
