const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.DB_URL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             useFindAndModify: false
//         });
//         console.log('DB connected');
//     } catch (error) {
//         console.log(error);
//         process.exit(1);
//     }
// }

mongoose.connect(process.env.DATABASE, {});

mongoose.connection.on('error', (error) => {
    console.log(error);
});
