import { Header } from "../../components/Header/Header";
import { SpotMap } from "./components/SpotMap/SpotMap";

export function MapPage() {
  return (
    <>
      <Header style="map" />
      <main className="w-screen h-full z-0">
        <SpotMap zoom={14} />
      </main>
    </>
  )
}
