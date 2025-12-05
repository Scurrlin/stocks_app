import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if(!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    if(!MONGODB_URI) throw new Error('MONGODB_URI must be set within .env');

    if(cached.conn) return cached.conn;

    const isNewConnection = !cached.promise;
    
    if(isNewConnection) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    // Only log on new connections
    if(isNewConnection) {
        const redactedUri = MONGODB_URI.replace(/\/\/[^@]+@/, '//***:***@');
        console.log(`Connected to database ${process.env.NODE_ENV} - ${redactedUri}`);
    }

    return cached.conn;
}
