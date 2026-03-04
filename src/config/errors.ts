export const geolocationErrors = {
    profile: {
        1: "Bummer! Your GPS just bailed. Allow location access or find your home spot manually.",
        2: "Can’t lock your spot! Try searching it instead.",
        3: "Too slow on the roll… Location timed out. Set your spot manually.",
        coordinates_issue: "GPS wobble! Try again with the 'Use your current location' button."
    },
    map: {
        1: "Location blocked! Allow location access to keep rolling on the map.",
        2: "Lost your line! Couldn’t find your spot. Try again in a moment.",
        3: "Timeout! Your GPS took a pit stop—try again later.",
    },
    locationUpdate: "Couldn’t set your home location. Roll back and try again soon."
} as const;

export const riderPreferencesErrors = {
    skill: "Failed to update your skills. Let's retry that trick!",
    spot_types: "Style didn't land. Retry?",
    skating_style: "Failed to update your spot preferences. One more go?"
};

export const authErrors = {
    invalid_credentials: "Wipeout! You missed your trick. Double-check your email and password.",
    weak_password: "⚡ That password needs more momentum! Roll with at least 6 characters.",
    user_already_exists: "Whoa, you're already rolling with us! Try logging in.",
    validation_failed: "One last checkpoint before you ride: verify your email!",
    user_not_found: "No rider found with those credentials. Want to sign up?",
    too_many_requests: "Slow down, rider! Go clean your bearings and try again later.",
    generic: "Something unexpected happened. Mind trying again?"
};

export const spotErrors = {
    add: {
        missing_coordinates: "No spot locked! Pick a location before dropping your route.",
        missing_spot_type: "What's the spot type? Select an option before dropping your spot!",
        missing_traffic_level: "Traffic level needed! Check 'unknown' if you're not sure.",
        generic: "Wipeout! Something went wrong adding your spot. Try again in a bit.",
        invalid_maps_link: "It looks like that link does not point to any valid coordinates."
    },
    delete: {
        spot: "Sorry, your spot could not be deleted. Try again later.",
        picture: "That picture could not be deleted. Try again later.",
        review: "Your comment could not be deleted. Try again later."
    },
    review: {
        23505: "You've already rated this spot!",
        generic: "Something went wrong, please try again"
    }
};

export const udpdateError = "Oops! Update failed. Try again."


export const deleteUserError = "Account bail failed! Your profile is still rolling. Try again in a bit.";