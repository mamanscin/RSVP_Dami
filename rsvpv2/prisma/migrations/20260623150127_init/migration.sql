-- CreateTable
CREATE TABLE "Rsvp" (
    "id" TEXT NOT NULL,
    "attending" BOOLEAN NOT NULL,
    "guestCount" INTEGER NOT NULL,
    "guests" JSONB NOT NULL,
    "wishes" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "userAgent" TEXT,
    "ipHash" TEXT,
    CONSTRAINT "Rsvp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wish" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "approved" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Wish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Rsvp_submittedAt_idx" ON "Rsvp"("submittedAt");

-- CreateIndex
CREATE INDEX "Wish_createdAt_idx" ON "Wish"("createdAt");
