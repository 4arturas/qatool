-- Organization definition

CREATE TABLE "Organization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- "User" definition

CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" DATETIME,
    "orgId" INTEGER NOT NULL,
    CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- UserRole definition

CREATE TABLE "UserRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "UserRole_name_userId_key" ON "UserRole"("name", "userId");

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
    "executed" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "QaObject_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "QaObjectType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QaObject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QaObjectType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
-- QaObjectRelationship definition
CREATE TABLE "QaObjectRelationship" (
                                      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                      "parentId" INTEGER NOT NULL,
                                      "childrenId" INTEGER NOT NULL,
                                      "childrenObjectTypeId" INTEGER NOT NULL,
                                      CONSTRAINT "QaObjectRelationship_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "QaObject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
                                      CONSTRAINT "QaObjectRelationship_childrenId_fkey" FOREIGN KEY ("childrenId") REFERENCES "QaObject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
                                      CONSTRAINT "QaObjectRelationship_childrenObjectTypeId_fkey" FOREIGN KEY ("childrenObjectTypeId") REFERENCES "QaObjectType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
