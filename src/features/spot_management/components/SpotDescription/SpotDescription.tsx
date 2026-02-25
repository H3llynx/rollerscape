import { Check, CheckLine, Edit2, MapPin, Navigation, Share, Trash2, X } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import Skater from "../../../../assets/hero.png";
import { Button } from "../../../../components/Button/Button";
import { SPOT_TYPES, TRAFFIC_LEVELS } from "../../../../config/spots";
import { sendToGps, shareSpot } from "../../../../services/spots";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSpots } from "../../../map/hooks/useSpots";
import "../../styles/spot_management.css";
import { RiderCard } from "../RiderCard/RiderCard";

type SpotDescription = {
    onEdit: () => void;
    onDelete: () => void;
}

export function SpotDescription({ onEdit, onDelete }: SpotDescription) {
    const isTabletorDesktop = useMediaQuery({ minWidth: 768 });
    const { profile } = useAuth();
    const { selectedSpot, setSelectedSpot } = useSpots();
    if (!selectedSpot) return;

    const src = selectedSpot.photos && selectedSpot.photos.length > 0
        ? selectedSpot.photos[0]
        : Skater

    return (
        <>
            <div className="hidden md:block relative  w-full h-[240px] z-0 shadow-sm shadow-rgba-grey">
                <img src={src} alt="" className="w-full h-full object-cover" />
                {selectedSpot.created_by &&
                    <>
                        <div className="spot-created-by bg-blur">
                            Submitted by
                            <span className="font-bold text-text-secondary">
                                {selectedSpot.created_by_name}
                            </span>
                        </div>
                        <div className="rider-card-container right-[5px] bottom-[28px]">
                            <RiderCard riderId={selectedSpot.created_by} />
                        </div>
                    </>
                }
            </div>
            <article className="pb-2 md:py-1 text-sm relative z-1">

                <div className="px-1 md:px-2">
                    <div className="flex gap-2 justify-between items-start">
                        <div>
                            <h1>{selectedSpot.name}</h1>
                            <div className="flex gap-0.5 mt-1 flex-wrap">
                                {selectedSpot.spot_spot_types.map((type, i) => (
                                    <span className="tag" key={i} >
                                        {SPOT_TYPES
                                            .filter(selectedSpot => selectedSpot.value === type.name)
                                            .map(selectedSpot => selectedSpot.label)
                                        }
                                    </span>
                                )
                                )}
                            </div>
                            {selectedSpot.created_by && !isTabletorDesktop &&
                                <div className="flex gap-[5px] items-center text-xs my-1">
                                    Submitted by
                                    <span className="text-text-secondary font-bold">
                                        {selectedSpot.created_by_name}
                                    </span>
                                </div>
                            }
                        </div>
                        <div className="button-container">
                            <Button style="icon" aria-label="share selected spot" onClick={() => shareSpot(selectedSpot)}>
                                <Share aria-hidden />
                            </Button>
                            <Button style="icon" aria-label="Send to GPS app" onClick={() => sendToGps(selectedSpot)}>
                                <Navigation aria-hidden />
                            </Button>
                            {profile && (profile.id === selectedSpot.created_by) &&
                                <>
                                    <Button style="icon" aria-label="edit selected spot" onClick={onEdit}>
                                        <Edit2 aria-hidden />
                                    </Button>
                                    <Button style="icon" aria-label="Delete spot" onClick={onDelete}>
                                        <Trash2 aria-hidden />
                                    </Button>
                                </>
                            }
                        </div>
                        <Button style="icon" className="hidden md:block absolute right-0 top-0" aria-label="Close description" onClick={() => setSelectedSpot(null)}>
                            <X aria-hidden />
                        </Button>
                    </div>
                    <div className="flex items-center gap-[5px] text-grey mt-1">
                        <MapPin aria-hidden width={15} /><span>{selectedSpot.address}</span>
                    </div>
                    <div className="w-full flex gap-1 justify-between items-center flex-wrap my-1">
                        <div className="flex items-center gap-[5px]">
                            <h3>Surface quality:</h3>{selectedSpot.surface_quality}/5</div>
                        {selectedSpot.has_obstacles && <span className="flex items-center gap-[5px] text-medium text-text-secondary"><CheckLine width={15} /> Obstacles</span>}
                        {selectedSpot.length_km &&
                            <div className="flex items-center gap-[5px]"><h3>Distance:</h3>{selectedSpot.length_km} km</div>
                        }
                        <div className="flex items-center gap-[5px]">
                            <h3>Average score</h3>{selectedSpot.average_rating ? selectedSpot.average_rating : (<span className="text-grey text-sm">No valoration given</span>)}
                        </div>
                    </div>
                    <div className={`flex gap-[5px] ${selectedSpot.spot_traffic_levels.length > 1 ? "flex-col" : "flex-row"}`}>
                        <h3>Traffic level:</h3>
                        <ul>
                            {selectedSpot.spot_traffic_levels.map(level =>
                                <li
                                    key={level.id}
                                    className={`${selectedSpot.spot_traffic_levels.length > 1 ? "text-xs" : ""} text-text-secondary font-medium`}>
                                    {selectedSpot.spot_traffic_levels.length > 1 && <Check aria-hidden width={12} height={20} className="inline mr-[5px]" />}
                                    {TRAFFIC_LEVELS
                                        .filter(l => l.value === level.name)
                                        .map(l => l.label)}
                                </li>
                            )}
                        </ul>
                    </div>
                    {
                        selectedSpot.description &&
                        <>
                            <h3 className="mt-1">Description:</h3>
                            {selectedSpot.description}
                        </>
                    }
                </div>
                {
                    selectedSpot.photos && selectedSpot.photos.length > 0 &&
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
                }
            </article>
        </>
    )
}