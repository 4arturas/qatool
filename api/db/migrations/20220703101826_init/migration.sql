-- public."Organization" definition

-- Drop table

-- DROP TABLE public."Organization";

CREATE TABLE public."Organization" (
	id serial4 NOT NULL,
	name text NOT NULL,
	active bool NOT NULL DEFAULT true,
	"createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Organization_pkey" PRIMARY KEY (id)
);

-- public."User" definition

-- Drop table

-- DROP TABLE public."User";

CREATE TABLE public."User" (
	id serial4 NOT NULL,
	uuid text NOT NULL,
	email text NOT NULL,
	"hashedPassword" text NOT NULL,
	salt text NOT NULL,
	"resetToken" text NULL,
	"resetTokenExpiresAt" timestamp(3) NULL,
	active bool NOT NULL DEFAULT false,
	"createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	deleted timestamp(3) NULL,
	"orgId" int4 NOT NULL,
	"mfaSecret" text NULL,
	"mfaSet" bool NOT NULL DEFAULT false,
	CONSTRAINT "User_pkey" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);
CREATE UNIQUE INDEX "User_uuid_key" ON public."User" USING btree (uuid);


-- public."User" foreign keys

ALTER TABLE public."User" ADD CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES public."Organization"(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- public."UserRole" definition

-- Drop table

-- DROP TABLE public."UserRole";

CREATE TABLE public."UserRole" (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	"userId" int4 NULL,
	active bool NOT NULL DEFAULT true,
	"createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "UserRole_pkey" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX "UserRole_name_userId_key" ON public."UserRole" USING btree (name, "userId");


-- public."UserRole" foreign keys

ALTER TABLE public."UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON DELETE SET NULL ON UPDATE CASCADE;


-- public."QaObjectType" definition

-- Drop table

-- DROP TABLE public."QaObjectType";

CREATE TABLE public."QaObjectType" (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "QaObjectType_pkey" PRIMARY KEY (id)
);

-- public."QaObject" definition

-- Drop table

-- DROP TABLE public."QaObject";

CREATE TABLE public."QaObject" (
	id serial4 NOT NULL,
	"typeId" int4 NOT NULL,
	"name" text NOT NULL,
	description text NULL,
	"batchId" int4 NULL,
	threads int4 NULL,
	loops int4 NULL,
	"json" text NULL,
	jsonata text NULL,
	address text NULL,
	"method" text NULL,
	"header" text NULL,
	"createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp(3) NOT NULL,
	executed timestamp(3) NULL,
	"orgId" int4 NOT NULL,
	CONSTRAINT "QaObject_pkey" PRIMARY KEY (id)
);


-- public."QaObject" foreign keys

ALTER TABLE public."QaObject" ADD CONSTRAINT "QaObject_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES public."Organization"(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE public."QaObject" ADD CONSTRAINT "QaObject_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES public."QaObjectType"(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- public."QaObjectRelationship" definition

-- Drop table

-- DROP TABLE public."QaObjectRelationship";

CREATE TABLE public."QaObjectRelationship" (
	id serial4 NOT NULL,
	"parentId" int4 NOT NULL,
	"childrenId" int4 NOT NULL,
	"childrenObjectTypeId" int4 NOT NULL,
	CONSTRAINT "QaObjectRelationship_pkey" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX "QaObjectRelationship_childrenId_key" ON public."QaObjectRelationship" USING btree ("childrenId");


-- public."QaObjectRelationship" foreign keys

ALTER TABLE public."QaObjectRelationship" ADD CONSTRAINT "QaObjectRelationship_childrenId_fkey" FOREIGN KEY ("childrenId") REFERENCES public."QaObject"(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE public."QaObjectRelationship" ADD CONSTRAINT "QaObjectRelationship_childrenObjectTypeId_fkey" FOREIGN KEY ("childrenObjectTypeId") REFERENCES public."QaObjectType"(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE public."QaObjectRelationship" ADD CONSTRAINT "QaObjectRelationship_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."QaObject"(id) ON DELETE RESTRICT ON UPDATE CASCADE;


-- public."ExperimentResult" definition

-- Drop table

-- DROP TABLE public."ExperimentResult";

CREATE TABLE public."ExperimentResult" (
	id serial4 NOT NULL,
	"type" int4 NOT NULL,
	"experimentId" int4 NULL,
	"collectionId" int4 NULL,
	"suiteId" int4 NULL,
	"caseId" int4 NULL,
	"testId" int4 NULL,
	thread int4 NULL,
	"loop" int4 NULL,
	"paymentId" text NULL,
	request text NULL,
	response text NULL,
	"requestDate" timestamp(3) NULL,
	"responseDate" timestamp(3) NULL,
	status int4 NULL,
	"statusText" text NULL,
	"txnId" text NULL,
	jsonata text NULL,
	CONSTRAINT "ExperimentResult_pkey" PRIMARY KEY (id)
);

-- public."Scheduler" definition

-- Drop table

-- DROP TABLE public."Scheduler";

CREATE TABLE public."Scheduler" (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	"executeAt" timestamp(3) NOT NULL,
	times int4 NOT NULL,
	executed bool NOT NULL DEFAULT false,
	"createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Scheduler_pkey" PRIMARY KEY (id)
);

-- public."_QaObjectToScheduler" definition

-- Drop table

-- DROP TABLE public."_QaObjectToScheduler";

CREATE TABLE public."_QaObjectToScheduler" (
	"A" int4 NOT NULL,
	"B" int4 NOT NULL
);
CREATE UNIQUE INDEX "_QaObjectToScheduler_AB_unique" ON public."_QaObjectToScheduler" USING btree ("A", "B");
CREATE INDEX "_QaObjectToScheduler_B_index" ON public."_QaObjectToScheduler" USING btree ("B");


-- public."_QaObjectToScheduler" foreign keys

ALTER TABLE public."_QaObjectToScheduler" ADD CONSTRAINT "_QaObjectToScheduler_A_fkey" FOREIGN KEY ("A") REFERENCES public."QaObject"(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."_QaObjectToScheduler" ADD CONSTRAINT "_QaObjectToScheduler_B_fkey" FOREIGN KEY ("B") REFERENCES public."Scheduler"(id) ON DELETE CASCADE ON UPDATE CASCADE;
