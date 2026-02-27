import { Check, CircleCheck, MapPin, PencilLine, Star, X } from "lucide-react";
import { useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Skater from "../../../../assets/hero.png";
import { Button } from "../../../../components/Button/Button";
import { TRAFFIC_LEVELS } from "../../../../config/spots";
import { SKATING_STYLES } from "../../../../config/user_info";
import { getSpotType } from "../../../../utils/helpers";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSpots } from "../../../map/hooks/useSpots";
import "../../styles/spot_management.css";
import { ButtonContainer } from "../ButtonContainer/ButtonContainer";
import { CommentForm } from "../CommentForm/CommentForm";
import { RiderCard } from "../RiderCard/RiderCard";

type SpotDescription = {
    onEdit: () => void;
    onDelete: () => void;
}

export function SpotDescription({ onEdit, onDelete }: SpotDescription) {
    const isTabletorDesktop = useMediaQuery({ minWidth: 768 });
    const { selectedSpot, setSelectedSpot } = useSpots();
    if (!selectedSpot) return;
    const { profile } = useAuth();
    const [isRating, setIsRating] = useState<boolean>(false);
    const commentsRef = useRef<HTMLDivElement>(null);

    const src = selectedSpot.photos && selectedSpot.photos.length > 0
        ? selectedSpot.photos[0]
        : Skater

    const handleComment = () => {
        setIsRating(true);
        commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <>
            <div className="hidden md:block relative w-full h-[240px] z-0 shadow-sm shadow-rgba-grey">
                <img src={src} onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src !== Skater) {
                        img.src = Skater;
                    }
                }}
                    alt="" className="w-full h-full object-cover" />
                {selectedSpot.created_by &&
                    <>
                        <div className="spot-created-by bg-blur">
                            Submitted by
                            <span className="font-bold text-text-secondary">
                                {selectedSpot.creator_profile.name}
                            </span>
                        </div>
                        <div className="rider-card-container right-[5px] bottom-[28px]">
                            <RiderCard />
                        </div>
                    </>
                }
            </div>
            <article className="pb-2 md:py-1 text-sm relative z-1">
                <div className="px-1 md:px-2">
                    <div className="flex gap-2 justify-between items-start">
                        <div>
                            <h1>{selectedSpot.name}</h1>
                            <div className="flex gap-0.5 mt-1 items-start flex-wrap">
                                {selectedSpot.spot_types.map((type, i) => (
                                    <span className="tag" key={i} >
                                        {getSpotType(type.name)}
                                    </span>
                                )
                                )}
                            </div>
                            {selectedSpot.created_by && !isTabletorDesktop &&
                                <div className="text-xs mt-1">
                                    <p className="flex gap-[5px] items-center flex-wrap">
                                        Submitted by
                                        <span className="text-text-secondary font-bold">
                                            {selectedSpot.creator_profile.name}
                                        </span>
                                    </p>
                                    <ul className="mx-0 mt-[5px]">
                                        {selectedSpot.creator_profile.skating_style &&
                                            <>
                                                <span>Skating style: </span>
                                                {selectedSpot.creator_profile.skating_style.map((style, i) => (
                                                    <li className="inline-block pr-0.5" key={i}>
                                                        <CircleCheck className="inline text-text-secondary mr-[3px]" width={15} height={15} />
                                                        {SKATING_STYLES
                                                            .filter(s => s.value === style)
                                                            .map(s => s.label)
                                                        }
                                                    </li>
                                                ))}
                                            </>
                                        }
                                    </ul>
                                </div>
                            }
                        </div>
                        <ButtonContainer onEdit={onEdit} onDelete={onDelete} spot={selectedSpot} />
                        <Button style="icon" className="hidden md:block absolute right-0 top-0" aria-label="Close description" onClick={() => setSelectedSpot(null)}>
                            <X aria-hidden />
                        </Button>
                    </div>
                    <div className="flex items-center gap-[5px] text-grey mt-1">
                        <MapPin aria-hidden width={15} /><span>{selectedSpot.address}</span>
                    </div>
                    <div className="w-full flex gap-1 justify-between items-center flex-wrap my-1">
                        <div className="flex items-center gap-[5px]">
                            <h3>Surface quality:</h3>
                            {selectedSpot.surface_quality &&
                                <span aria-label={`${selectedSpot.surface_quality}`}>
                                    {Array.from({ length: selectedSpot.surface_quality }, (_, i) => (
                                        <span key={i} aria-hidden><Star fill="var(--color-text)" width={15} className="inline text-text mr-[3px]" /></span>
                                    ))}
                                </span>
                            }
                        </div>
                        <div className="flex items-center gap-[5px] flex-wrap">
                            <h3>Average rating:</h3>
                            {selectedSpot.average_rating
                                ? selectedSpot.average_rating
                                : <div className="text-xs">
                                    <span className=" text-grey mr-0.5">No punctuation given yet </span>
                                    {profile &&
                                        <Button style="tertiary" className="text-xs p-0 inline" onClick={handleComment}>
                                            <PencilLine aria-hidden className="inline" width={13} /> Be the first to comment
                                        </Button>
                                    }
                                </div>
                            }
                        </div>
                        {selectedSpot.length_km &&
                            <div className="flex items-center gap-[5px]">
                                <h3>Distance:</h3>{selectedSpot.length_km} km</div>
                        }
                    </div>
                    <div className={`flex gap-[5px] ${selectedSpot.traffic_levels.length > 1 ? "flex-col" : "flex-row"}`}>
                        <h3>Traffic level:</h3>
                        <ul>
                            {selectedSpot.traffic_levels.map(level =>
                                <li
                                    key={level.id}
                                    className={`${selectedSpot.traffic_levels.length > 1 ? "text-xs" : ""}`}>
                                    {selectedSpot.traffic_levels.length > 1 && <Check aria-hidden width={12} height={20} className="inline mr-[5px]" />}
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
                <div ref={commentsRef} className="px-1 md:px-2 my-3">
                    {
                        profile && isRating &&
                        <CommentForm />
                    }
                </div>
            </article >
        </>
    )
}