import cron from 'node-cron';

export default cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});
