-- CreateTable
CREATE TABLE "QaObject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "typeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "batchId" INTEGER,
    "threads" INTEGER,
    "loops" INTEGER,
    "json" TEXT,
    "jsonata" TEXT,
    "address" TEXT,
    "method" TEXT,
    "header" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "QaObject_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "QaObjectType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QaObjectType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "QaObjectRelationship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parentId" INTEGER NOT NULL,
    "childrenId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" INTEGER NOT NULL,
    "request" TEXT,
    "response" TEXT,
    "requestDate" DATETIME,
    "responseDate" DATETIME,
    "httpCode" INTEGER,
    "txnId" TEXT,
    "jsonata" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "QaObjectRelationship_parentId_childrenId_key" ON "QaObjectRelationship"("parentId", "childrenId");
