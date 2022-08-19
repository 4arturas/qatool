// To access your database
// Append api/* to import from api and web/* to import from web
import { db } from 'api/src/lib/db'
import {logger} from "api/src/lib/logger";
import {updateScheduler} from "api/src/services/schedulers/schedulers";
import {runExperiment} from "api/src/services/experiment/experiment";


export default async ({ args }) => {
  // Your script here...
  console.log(':: Executing script with args ::')
  console.log(args)

  logger.debug(`Beginning Experiment JOB`)
  const schedulers = await db.scheduler.findMany({
    where: {
      AND : [
        { executed: false },
        { executeAt: { gte: new Date() } }
      ]
    },
    select: {
      id: true,
      name: true,
      executeAt: true,
      times: true,
      executed: true,
      experiments: true,
    }
  });
  logger.debug({ schedulers }, `${schedulers.length} schedulers were found`);
  if ( schedulers.length === 0 )
  {
    logger.debug(`Nothing to do`);
    return;
  }
  const scheduler = schedulers[0];
  logger.debug( { scheduler }, `Taking the first scheduler` );
  await updateScheduler( { id: scheduler.id, input: { executed: true } } );

  // TODO: implement scheduler.times
  for ( let i = 0; i < scheduler.experiments.length; i++ )
  {
    const experiment = scheduler.experiments[i];
    logger.debug({experiment}, `Running experiment` );
    await runExperiment( { experimentId: experiment.id, delay: 0 } )
  }
}
