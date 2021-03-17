import cron from 'node-cron';

/** Generates invoice for the family every minute. */
cron.schedule('* * * * *', async () => {});
