-- CreateTable
CREATE TABLE "SerialNumberTemp" (
    "id" TEXT NOT NULL,
    "number" VARCHAR(16) NOT NULL,
    "productTempId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SerialNumberTemp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SerialNumberTemp_number_key" ON "SerialNumberTemp"("number");

-- AddForeignKey
ALTER TABLE "SerialNumberTemp" ADD CONSTRAINT "SerialNumberTemp_productTempId_fkey" FOREIGN KEY ("productTempId") REFERENCES "ProductTemp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
