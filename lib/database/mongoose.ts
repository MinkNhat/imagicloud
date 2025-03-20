import mongoose, {Mongoose} from 'mongoose';
// Vì nextjs dùng serverless enviroment nên cần tạo lại connection mỗi lần request ==> cần lưu lại cached connection

const MONGODB_URL=process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose

if(!cached){
    cached= (global as any).mongoose = {
        conn:null,
        promise:null
    }
}

export const connectToDatabase = async() => {
    // check nếu connection đã có trong cache
   if(cached.conn) return cached.conn; 
   
   if(!MONGODB_URL) throw new Error('Missing MONGODB_URL');

    // nếu chưa có connection thì tạo mới
   cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {dbName: 'imagecloud', bufferCommands: false})

    cached.conn = await cached.promise;
    return cached.conn;  
}  