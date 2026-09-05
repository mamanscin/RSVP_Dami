-- Link wishes submitted through the RSVP form to their source RSVP.
ALTER TABLE "Wish" ADD COLUMN "rsvpId" TEXT;

CREATE UNIQUE INDEX "Wish_rsvpId_key" ON "Wish"("rsvpId");

ALTER TABLE "Wish"
ADD CONSTRAINT "Wish_rsvpId_fkey"
FOREIGN KEY ("rsvpId") REFERENCES "Rsvp"("id")
ON DELETE CASCADE ON UPDATE CASCADE;