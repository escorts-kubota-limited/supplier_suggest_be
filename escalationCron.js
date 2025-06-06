// import cron from 'node-cron';
// import { Op } from 'sequelize';
// import models from './models/index.js' ;
// const { Suggestion, EsclationMatrix } =  models;
// import { sendSuggestionCreationMail } from './mail/mailController';

// // Runs every day at 2 AM
// cron.schedule('0 2 * * *', async () => {
//   const now = new Date();

//   const suggestions = await Suggestion.findAll();

//   for (const suggestion of suggestions) {
//     const lastUpdated = new Date(suggestion.updatedAt);
//     const diffDays = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));

//     // Skip if suggestion is actively updated within 5 days
//     if (diffDays < 5) continue;

//     const escalation = await EsclationMatrix.findOne({
//       where: { email: suggestion.buyer_email },
//     });

//     if (!escalation) continue;

//     // Check if already escalated to reportingManager
//     if (suggestion.buyer_email === escalation.email) {
//       // Step 1: Escalate to reportingManager
//       await sendSuggestionCreationMail({
//         to: escalation.reportingManager,
//         name: escalation.reportingManagerName,

//       });

//       await suggestion.update({
//         buyer_email: escalation.reportingManager,
//       });
//     } else if (suggestion.buyer_email === escalation.reportingManager && diffDays >= 10) {
//       // Step 2: Escalate to skipManager
//       await sendSuggestionCreationMail({
//         to: escalation.skipManager,
//         name: escalation.skipManagerName,
     
//       });

//       await suggestion.update({
//         buyer_email: escalation.skipManager,
//       });
//     }
//   }
// });

import cron from 'node-cron';
import { Op } from 'sequelize';
import models from './models/index.js';
const { Suggestion, EsclationMatrix, User } = models;
import { sendSuggestionCreationMail } from './mail/mailController.js';

cron.schedule('0 2 * * *', async () => {
  const now = new Date();
  const suggestions = await Suggestion.findAll();

  for (const suggestion of suggestions) {
    const lastUpdated = new Date(suggestion.updatedAt);
    const diffDays = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));

    if (diffDays < 1) continue;

    const escalation = await EsclationMatrix.findOne({
      where: { email: suggestion.buyer_email },
    });

    if (!escalation) continue;
    // First escalation (after 40s)
    if (suggestion.buyer_email === escalation.email) {

         const submittedUser = await User.findOne({
        where: { email: escalation.reportingManager },
    });

      await sendSuggestionCreationMail(
        escalation.reportingManager,
        escalation.reportingManagerName || 'Reporting Manager',
      );

      await suggestion.update({
        submitted_by : submittedUser.id,
        buyer_email: escalation.reportingManager,
        buyer_name: escalation.reportingManagerName || 'Reporting Manager',
      });

    // Second escalation (after 80s)
    } else if (suggestion.buyer_email === escalation.reportingManager && diffSeconds >= 80) {
      await sendSuggestionCreationMail(
        escalation.skipManager,
         escalation.skipManagerName || 'Skip Manager',
      );

      const submittedUser = await User.findOne({
        where: { email: escalation.reportingManager },
    });
      await suggestion.update({
        submitted_by : submittedUser.id,

        buyer_email: escalation.skipManager,
        buyer_name: escalation.skipManagerName || 'Skip Manager',
      });
    }
  }

  console.log(`Escalation check completed at ${now.toISOString()}`);
});


