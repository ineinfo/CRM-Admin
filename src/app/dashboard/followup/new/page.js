"use client"
import { useSearchParams } from "next/navigation";
import FollowupForm from "src/sections/followup/Followup-new-edit-form";
import FollowupCardsView from "src/sections/followup/view/Followup-card-view";


// ----------------------------------------------------------------------



export default function ProductCreatePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  return <>
    <FollowupCardsView id={id} /></>;
}
