import prisma from '../src/lib/prisma';
import { getSupabaseClient } from '../src/lib/supabase';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

async function run() {
  const supabase = getSupabaseClient();

  // Create bucket if not exists
  console.log("Checking bucket...");
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === 'trade-screenshots')) {
    console.log("Bucket 'trade-screenshots' not found. Creating it...");
    const { error: createError } = await supabase.storage.createBucket('trade-screenshots', {
      public: false,
    });
    if (createError) {
      console.error("Failed to create bucket:", createError);
      return;
    }
  }

  console.log("\n=== SCENARIO 2: Test Upload and Create Trade with JournalEntry ===");
  const userId = 'cmrt5v6pm00001cuhvkg9u5fn';
  
  // 1. Upload to Supabase
  console.log("Uploading to Supabase...");
  const imagePath = path.resolve('C:\\Users\\Hasan\\.gemini\\antigravity-ide\\brain\\f8094f77-13d3-4fd2-a4fa-7d55ab129d58\\dummy_screenshot_1784688749175.png');
  const buffer = fs.readFileSync(imagePath);
  
  const fileName = `${Date.now()}-${uuidv4()}.png`;
  const storagePath = `${userId}/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('trade-screenshots')
    .upload(storagePath, buffer, { contentType: 'image/png' });

  if (uploadError) {
    console.error("Upload failed!", uploadError);
    return;
  }
  
  const savedScreenshotPath = uploadData.path;
  console.log("Upload success! Path:", savedScreenshotPath);

  // 2. Save Trade
  console.log("Saving trade to DB...");
  const newTrade = await prisma.trade.create({
    data: {
      userId,
      pair: 'ETH/USD',
      direction: 'BUY',
      entryPrice: 3000,
      positionSize: 2,
      tradeDate: new Date(),
      journalEntry: {
        create: {
          notes: 'I felt very rushed to enter this trade.',
          emotionTags: ['FOMO'],
          screenshotUrl: savedScreenshotPath
        }
      }
    },
    include: { journalEntry: true }
  });

  // 3. Simulate GET new trade (generates signed URL)
  console.log("Fetching new trade (Simulating GET API)...");
  const { data: signedData } = await supabase.storage
    .from('trade-screenshots')
    .createSignedUrl(newTrade.journalEntry!.screenshotUrl!, 3600);

  const response2 = {
    ...newTrade,
    journalEntry: {
      ...newTrade.journalEntry,
      screenshotUrl: signedData?.signedUrl
    }
  };
  console.log(JSON.stringify(response2, null, 2));
}

run();
