-- CreateTable
CREATE TABLE "Rsvp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attending" BOOLEAN NOT NULL,
    "guestCount" INTEGER NOT NULL,
    "guests" JSONB NOT NULL,
    "wishes" TEXT,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "userAgent" TEXT,
    "ipHash" TEXT
);

-- CreateTable
CREATE TABLE "Wish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "approved" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE INDEX "Rsvp_submittedAt_idx" ON "Rsvp"("submittedAt");

-- CreateIndex
CREATE INDEX "Wish_createdAt_idx" ON "Wish"("createdAt");
