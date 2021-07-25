// TODO WorkInProgress Not Ready to be submitted
WorkInProgress....
const express = require('express');
const app = express();
const { eventRouter, memberRouter } = require('./routers');

app.use(express.json());
app.use('/api/events', eventRouter);
app.use('/api/members', memberRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is now up listening on port ${port}`);
});
