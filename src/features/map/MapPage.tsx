import { Header } from "../../components/Header/Header";
import { Map } from "./components/Map/Map";

export function MapPage() {
  return (
    <>
      <Header style="map" />
      <main className="w-screen h-full z-0">
        <Map zoom={14} />
      </main>
    </>
  )
}
