import { db } from 'src/lib/db'
import type {
  QueryResolvers,
  MutationResolvers,
  SchedulerResolvers,
} from 'types/graphql'
import {EXPERIMENT} from "src/functions/global";

export const schedulers: QueryResolvers['schedulers'] = () => {
  return db.scheduler.findMany()
}

export const scheduler: QueryResolvers['scheduler'] = ({ id }) => {
  return db.scheduler.findUnique({
    where: { id },
  })
}

export const schedulerEdit: QueryResolvers['schedulerEdit'] = async ({ id }) => {
  const scheduler = await db.scheduler.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      executeAt: true,
      times: true,
      executed: true,
      experiments: true,
    }
  });

  const experimentsAll = await db.qaObject.findMany({
    where: {
      typeId: {
        equals: EXPERIMENT
      }
    },
  });
  return {
    id: scheduler.id,
    name: scheduler.name,
    executeAt: scheduler.executeAt,
    times: scheduler.times,
    executed: scheduler.executed,
    experiments: scheduler.experiments.map(e=>e.id),
    experimentsAll: experimentsAll
  };
}

export const createScheduler: MutationResolvers['createScheduler'] = ({
  input,
}) => {
  return db.scheduler.create({
    data: input,
  })
}

export const updateScheduler: MutationResolvers['updateScheduler'] = ( { id, input }) => {
  console.log( input);
  return db.scheduler.update({
    data: input,
    where: { id },
  })
}

export const schedulerUpdate  = async ( { id, input }) => {
  console.log( input);
  // input.experiments = input.experiments.map( v => { return { A: v, B: id } } );
  // input.experiments = input.experiments.map( v => { return { id: v } } );
/*  const test = await db.scheduler.update({
    data: input,
    where: { id },
  });*/


/*  const test = await db.scheduler.update({
             data: {
               id: 1,
               name: 'test',
               executeAt: new Date('2022-08-19T05:37:10.000Z'),
               times: 3,
             },
           where: {
               id: 1
             }
         })*/

  /*const updatePost = await db.scheduler.update({
    where: {
      id: input.id,
    },
    data: {
      // name: input.name,
      // executeAt: input.executeAt,
      // times: input.times,
      experiments: {
        // disconnect: [{ id: 12 }, { id: 19 }],
        // connect: input.experiments.map( e => { return { id: e } } )
        // connect: input.experiments.map( e => { return { id: e } } )
        // connect: input.experiments
      },
    },
    select: {
      id: true,
      name: true,
      executeAt: true,
      times: true,
      executed: true,
      // createdAt?: true,
      // updatedAt?: true,
      experiments: true,
      // _count?: true

    },
  });*/

  const updatePost = await db.scheduler.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      executeAt: input.executeAt,
      times: input.times,
      experiments: {
        disconnect: [ { id: 11 }],
        // connect: input.experiments.map( e => { return { id: e } } )
      },
    },
    select: {
      id: true,
      // name?: true,
      // executeAt?: true,
      // times?: true,
      // executed?: true,
      // createdAt?: true,
      // updatedAt?: true,
      // experiments?: true,
      // _count?: true

    },
  })

  return updatePost;

/*  const ba = await  db.scheduler.upsert({
    where: { id: id },
    create: {
      id: id,
      experiments: {
        connectOrCreate: input.experiments,
      },
    },
    update: {
      experiments: { connectOrCreate: input.experiments },
    },

  });*/

  return test;
}

export const deleteScheduler: MutationResolvers['deleteScheduler'] = ({
  id,
}) => {
  return db.scheduler.delete({
    where: { id },
  })
}

export const Scheduler: SchedulerResolvers = {
  experiments: (_obj, { root }) =>
    db.scheduler.findUnique({ where: { id: root.id } }).experiments(),
}
