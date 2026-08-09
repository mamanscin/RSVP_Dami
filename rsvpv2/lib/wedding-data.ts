// Centralised wedding data — change these values to customise the invitation.
// Latitude/longitude are used for the embedded Google Map.

export const wedding = {
  bride: {
    fullName: "Puteri Safa Natasha",
    shortName: "Puteri",
    father: "Megat Sharizal Amri bin Abdul Halim",
    mother: "Siti Rahayu binti Ahmad",
    fatherContact: "+60 11-3676 7583",
    motherContact: "+60 16-546 4119",
  },
  groom: {
    fullName: "Amir Izzudin",
    shortName: "Amir",
    father: "Zamri bin Marsid",
    mother: "Ritalaily binti Ishak",
    fatherContact: "+60 16-258 0677",
    motherContact: "+60 14-638 3457",
  },
  date: {
    iso: "2026-08-31T05:30:00+08:00",
    // Displayed via dictionary; this is the canonical source for sorting.
  },
  venue: {
    name: "The Glass Galore",
    address: "Tamarind Square, Cyberjaya, Selangor, Malaysia",
    // Tamarind Square, Cyberjaya — approximate centre of the commercial block.
    lat: 2.9213,
    lng: 101.6559,
    googleMapsUrl:
      "https://maps.google.com/maps?q=The+Glass+Galore+Tamarind+Square+Cyberjaya&hl=en&z=16&output=embed",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=The+Glass+Galore+Tamarind+Square+Cyberjaya",
  },
};
