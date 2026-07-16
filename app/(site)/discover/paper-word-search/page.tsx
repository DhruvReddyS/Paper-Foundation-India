import type { Metadata } from "next";
import PaperWordSearchGame from "@/components/games/PaperWordSearchGame";

export const metadata:Metadata={title:"Fibre Word Search",description:"Find ten paper words before the five-minute timer ends."};
export default function Page(){return <PaperWordSearchGame/>}
