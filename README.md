# TypeScript Next.js Feedback Application

This project is a full-stack TypeScript Next.js application that demonstrates the use of the App Router, MongoDB integration, and a dark-themed UI using Tailwind CSS. It allows users to post and view feedback.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB instance (local or cloud-based)

## Setup Instructions

1. **Create a new Next.js project with TypeScript:**

   ```bash
   npx create-next-app@latest my-feedback-app-ts
   cd my-feedback-app-ts
   ```

   Choose the following options when prompted:
   - Use TypeScript: Yes
   - Use ESLint: Yes
   - Use Tailwind CSS: Yes
   - Use `src/` directory: Yes
   - Use App Router: Yes
   - Customize the default import alias: No

2. **Install additional dependencies:**

   ```bash
   npm install axios mongoose
   ```

3. **Set up your folder structure:**

   ```
   my-feedback-app-ts/
   ├── src/
   │   ├── app/
   │   │   ├── api/
   │   │   │   └── feedback/
   │   │   │       └── route.ts
   │   │   ├── feedback/
   │   │   │   └── page.tsx
   │   │   ├── post-feedback/
   │   │   │   └── page.tsx
   │   │   ├── layout.tsx
   │   │   └── page.tsx
   │   ├── components/
   │   │   ├── ClientNavbar.tsx
   │   │   └── FeedbackForm.tsx
   │   ├── models/
   │   │   └── Feedback.ts
   │   └── utils/
   │       └── db.ts
   ├── .env.local
   └── tailwind.config.ts
   ```

4. **Set up MongoDB connection:**

   Create a `.env.local` file in the root directory and add your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string_here
   ```

5. **Create the database connection utility (`src/utils/db.ts`):**

   ```typescript
   import mongoose from 'mongoose';

   const MONGODB_URI = process.env.MONGODB_URI;

   if (!MONGODB_URI) {
     throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
   }

   let cached = global.mongoose;

   if (!cached) {
     cached = global.mongoose = { conn: null, promise: null };
   }

   async function connectDB() {
     if (cached.conn) {
       return cached.conn;
     }

     if (!cached.promise) {
       const opts = {
         bufferCommands: false,
       };

       cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
         return mongoose;
       });
     }

     try {
       cached.conn = await cached.promise;
     } catch (e) {
       cached.promise = null;
       throw e;
     }

     return cached.conn;
   }

   export default connectDB;
   ```

6. **Create the Feedback model (`src/models/Feedback.ts`):**

   ```typescript
   import mongoose, { Document, Model, Schema } from 'mongoose';

   export interface IFeedback extends Document {
     name: string;
     feedback: string;
     createdAt: Date;
     updatedAt: Date;
   }

   const FeedbackSchema: Schema = new Schema({
     name: {
       type: String,
       required: [true, 'Please provide a name'],
       maxlength: [60, 'Name cannot be more than 60 characters'],
     },
     feedback: {
       type: String,
       required: [true, 'Please provide feedback'],
       maxlength: [1000, 'Feedback cannot be more than 1000 characters'],
     },
   }, {
     timestamps: true,
   });

   const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

   export default Feedback;
   ```

7. **Create the API route (`src/app/api/feedback/route.ts`):**

   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   import connectDB from '@/utils/db';
   import Feedback, { IFeedback } from '@/models/Feedback';

   export async function POST(request: NextRequest) {
     await connectDB();
     const { name, feedback } = await request.json();

     try {
       const newFeedback: IFeedback = await Feedback.create({ name, feedback });
       return NextResponse.json(newFeedback, { status: 201 });
     } catch (error) {
       return NextResponse.json({ error: (error as Error).message }, { status: 400 });
     }
   }

   export async function GET() {
     await connectDB();

     try {
       const feedbacks: IFeedback[] = await Feedback.find({}).sort({ createdAt: -1 });
       return NextResponse.json(feedbacks);
     } catch (error) {
       return NextResponse.json({ error: (error as Error).message }, { status: 500 });
     }
   }
   ```

8. **Create the ClientNavbar component (`src/components/ClientNavbar.tsx`):**

   ```typescript
   'use client';

   import Link from 'next/link';

   const ClientNavbar: React.FC = () => {
     return (
       <nav className="bg-gray-800 p-4">
         <div className="container mx-auto flex justify-between items-center">
           <Link href="/" className="text-white text-xl font-bold">FeedbackApp</Link>
           <div className="space-x-4">
             <Link href="/post-feedback" className="text-white hover:text-gray-300 transition duration-300">Post Feedback</Link>
             <Link href="/feedback" className="text-white hover:text-gray-300 transition duration-300">View Feedback</Link>
           </div>
         </div>
       </nav>
     );
   };

   export default ClientNavbar;
   ```

9. **Create the FeedbackForm component (`src/components/FeedbackForm.tsx`):**

   ```typescript
   'use client';

   import { useState, FormEvent } from 'react';
   import axios from 'axios';

   const FeedbackForm: React.FC = () => {
     const [name, setName] = useState('');
     const [feedback, setFeedback] = useState('');

     const handleSubmit = async (e: FormEvent) => {
       e.preventDefault();
       try {
         await axios.post('/api/feedback', { name, feedback });
         alert('Feedback submitted successfully!');
         setName('');
         setFeedback('');
       } catch (error) {
         alert('Error submitting feedback');
       }
     };

     return (
       <form onSubmit={handleSubmit} className="space-y-4">
         <div>
           <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
           <input
             type="text"
             id="name"
             value={name}
             onChange={(e) => setName(e.target.value)}
             required
             className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
           />
         </div>
         <div>
           <label htmlFor="feedback" className="block text-sm font-medium text-gray-300">Feedback</label>
           <textarea
             id="feedback"
             value={feedback}
             onChange={(e) => setFeedback(e.target.value)}
             required
             rows={4}
             className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
           ></textarea>
         </div>
         <button type="submit" className="w-full px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition duration-300">Submit Feedback</button>
       </form>
     );
   };

   export default FeedbackForm;
   ```

10. **Create the layout file (`src/app/layout.tsx`):**

    ```typescript
    import './globals.css';
    import type { Metadata } from 'next';
    import ClientNavbar from '@/components/ClientNavbar';

    export const metadata: Metadata = {
      title: 'Feedback App',
      description: 'A simple feedback application',
    };

    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode
    }) {
      return (
        <html lang="en">
          <body className="bg-gray-900 text-white">
            <ClientNavbar />
            <main className="container mx-auto mt-8 px-4">{children}</main>
          </body>
        </html>
      );
    }
    ```

11. **Create the home page (`src/app/page.tsx`):**

    ```typescript
    const Home: React.FC = () => {
      return (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Feedback App</h1>
          <p className="text-xl">Choose an option from the navbar to get started.</p>
        </div>
      );
    };

    export default Home;
    ```

12. **Create the post feedback page (`src/app/post-feedback/page.tsx`):**

    ```typescript
    import FeedbackForm from '@/components/FeedbackForm';

    const PostFeedback: React.FC = () => {
      return (
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Post Your Feedback</h1>
          <FeedbackForm />
        </div>
      );
    };

    export default PostFeedback;
    ```

13. **Create the feedback display page (`src/app/feedback/page.tsx`):**

    ```typescript
    'use client';

    import { useState, useEffect } from 'react';
    import axios from 'axios';
    import { IFeedback } from '@/models/Feedback';

    const Feedback: React.FC = () => {
      const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);

      useEffect(() => {
        const fetchFeedbacks = async () => {
          try {
            const response = await axios.get<IFeedback[]>('/api/feedback');
            setFeedbacks(response.data);
          } catch (error) {
            console.error('Error fetching feedbacks:', error);
          }
        };

        fetchFeedbacks();
      }, []);

      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">Feedbacks</h1>
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-xl font-semibold">{feedback.name}</h2>
                <p className="mt-2">{feedback.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      );
    };

    export default Feedback;
    ```

14. **Update the Tailwind configuration (`tailwind.config.ts`):**

    ```typescript
    import type { Config } from 'tailwindcss';

    const config: Config = {
      content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      theme: {
        extend: {
          backgroundColor: {
            'gray-900': '#121212',
            'gray-800': '#1e1e1e',
            'gray-700': '#2d2d2d',
          },
          textColor: {
            'white': '#ffffff',
            'gray-300': '#d1d5db',
          },
        },
      },
      plugins: [],
    };

    export default config;
    ```

## Running the Application

1. Ensure you have a MongoDB instance running and update the `MONGODB_URI` in `.env.local` with your connection string.

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Features

- Dark-themed UI using Tailwind CSS
- Full-stack TypeScript implementation
- MongoDB integration for data persistence
- Next.js App Router for efficient routing
- Post and view feedback functionality

## Notes

- This application uses Next.js 13+ features, including the App Router and Server Components.
- Components using React hooks (like `useState` and `useEffect`) are marked with `'use client';` to specify them as Client Components.
- The application demonstrates the use of both Server and Client Components in a Next.js application.

Feel free to modify and extend this application as needed for your specific use case.