import { notFound } from "next/navigation";
import CenterDetails from "../CenterDetails";
import { getCenterDetails } from "@/lib/centerDetails";

export default async function CenterDetailsByIdPage({ params }) {
  const { id } = await params;
  const center = await getCenterDetails(id);

  if (!center) {
    notFound();
  }

  return <CenterDetails center={center} />;
}
