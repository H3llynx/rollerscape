import { Header } from "../../components/Header/Header";
import { SpotMap } from "./components/SpotMap/SpotMap";
import { SpotsProvider } from "./context/SpotsProvider";

export function MapPage() {
  return (
    <>
      <Header style="map" />
      <main className="w-screen h-full z-0">
        <SpotsProvider>
          <SpotMap zoom={14} />
        </SpotsProvider>
      </main>
    </>
  )
}
