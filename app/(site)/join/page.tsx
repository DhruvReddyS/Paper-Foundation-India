import type { Metadata } from "next";
import InitiativeForm from "@/components/home/sections/initiative-form/InitiativeForm";

export const metadata:Metadata={title:"Join the Foundation",description:"Complete the official Paper Foundation India membership application online."};
export default function Page(){return <InitiativeForm/>}
