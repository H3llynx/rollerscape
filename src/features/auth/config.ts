export const redirectURL = "/";

export const authErrors = {
    invalid_credentials: "Wipeout! You missed your trick. Double-check your email and password.",
    weak_password: "⚡ That password needs more momentum! Roll with at least 6 characters.", // investigate AuthWeakPasswordError
    user_already_exists: "Whoa, you're already rolling with us! Try logging in.",
    email_not_confirmed: "One last checkpoint before you ride: verify your email!", // pending to re-enable email verification on supabase
    user_not_found: "No rider found with those credentials. Want to sign up?",
    too_many_requests: "Slow down, rider! Go clean your bearings and try again later.",
    generic: "Something unexpected happened. Mind trying again?"
}