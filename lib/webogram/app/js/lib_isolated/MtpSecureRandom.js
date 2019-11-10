
// TODO (vserhiienko), on each click it takes current time and seeds randomizer.
// Imports both functions from jsbn_combined.js

function MtpSecureRandom ($window) {
    $($window).on('click keydown', rng_seed_time);
    return new SecureRandom();
}