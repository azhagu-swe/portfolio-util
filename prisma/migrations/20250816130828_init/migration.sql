-- CreateTable
CREATE TABLE "public"."Visitor" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT,
    "visitCount" INTEGER NOT NULL DEFAULT 1,
    "lastVisitAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_ip_key" ON "public"."Visitor"("ip");
