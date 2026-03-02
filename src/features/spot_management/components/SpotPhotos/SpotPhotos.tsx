import { useSpots } from "../../../map/hooks/useSpots";

export function SpotPhotos() {
    const { selectedSpot } = useSpots();
    if (!selectedSpot || !selectedSpot.photos || !selectedSpot.photos.length) return;
    return (
        <div className="gallery">
            <h3 className="mt-1">Photos:</h3>
            <div className="slider">
                {selectedSpot.photos.map((photo, i) => (
                    <img key={i}
                        src={photo}
                        alt="" />
                ))}
            </div>
        </div>
    )
}