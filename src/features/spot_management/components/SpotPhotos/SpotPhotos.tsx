import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { GalleryDialog } from "../../../../components/GalleryDialog/GalleryDialog";
import { useSpots } from "../../../map/hooks/useSpots";
import "./SpotPhotos.css";

export function SpotPhotos() {
    const { selectedSpot } = useSpots();
    const [initialIndex, setInitialIndex] = useState(0);
    const gridDialogRef = useRef<HTMLDialogElement>(null);

    const closeOnClickOut = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (!gridDialogRef) return;
        if (e.target === gridDialogRef.current)
            gridDialogRef.current?.close();
    };


    if (!selectedSpot?.photos?.length) return null;
    return (
        <div className="gallery">
            <h3 className="mt-1">Photos:</h3>
            <div className="slider">
                {selectedSpot.photos.map((photo, i) => (
                    <img
                        key={i}
                        src={photo}
                        alt=""
                        onClick={() => {
                            setInitialIndex(i);
                            gridDialogRef.current?.showModal();
                        }}
                    />
                ))}
            </div>
            <GalleryDialog ref={gridDialogRef} close={() => gridDialogRef.current?.close()} onClickOut={closeOnClickOut}>
                <Swiper
                    key={initialIndex}
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    initialSlide={initialIndex}
                    slidesPerView={1}
                >
                    {selectedSpot.photos.map((photo, i) => (
                        <SwiperSlide key={i}>
                            <img
                                src={photo}
                                alt=""
                                className="w-full max-h-[80vh] object-contain"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </GalleryDialog>
        </div>
    );
}