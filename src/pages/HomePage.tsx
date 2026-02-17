import { Header } from "../components/Header/Header";
import { Map } from "../features/map/components/Map";

export function HomePage() {
  return (
    <>
      <Header style="map" />
      <main className="w-screen h-full z-0">
        <Map />
      </main>
    </>
  )
}
