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

  const schedulerWithExperiments = await db.scheduler.findUnique({
    where: { id: id },
    select: { experiments: true }
  });

  const disconnect = schedulerWithExperiments.experiments.map( e => { return { id: e.id } } );
  const connect = input.experiments.map( e => { return { id: e } } );

  const updateScheduler = await db.scheduler.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      executeAt: input.executeAt,
      times: input.times,
      updatedAt: new Date(),
      experiments: {
        disconnect: disconnect,
        connect: connect
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
      // experiments?: true,
      // _count?: true

    },
  })

  return updateScheduler;
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
