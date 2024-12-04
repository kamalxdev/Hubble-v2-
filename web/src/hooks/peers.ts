import { iPeerContext, PeerContext } from "@/context/peers";
import { useContext } from "react";

export function usePeersProvider(){
    const peerProvider=useContext(PeerContext) as iPeerContext
    return peerProvider
}