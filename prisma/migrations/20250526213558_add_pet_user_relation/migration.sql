-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "telephone" TEXT,
    "idUser" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pet_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Pet" ("age", "breed", "createdAt", "description", "id", "imageUrl", "latitude", "longitude", "name", "status", "type", "updatedAt") SELECT "age", "breed", "createdAt", "description", "id", "imageUrl", "latitude", "longitude", "name", "status", "type", "updatedAt" FROM "Pet";
DROP TABLE "Pet";
ALTER TABLE "new_Pet" RENAME TO "Pet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
