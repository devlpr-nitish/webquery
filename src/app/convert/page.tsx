
'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { motion } from "framer-motion";
import { CopyIcon, DownloadIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});



export default function Convert() {
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [questions, setQuestions] = useState('');
  const [answer, setAnswer] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const urlRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    urlRef.current?.focus();
  }, []);

  const sendToGemini = async () => {
    setAnswer('');

    if (!url || url.trim().length == 0) {
      toast("Please enter a url");
      return;
    }
    if (!questions || questions.trim().length == 0) {
      toast("Please enter your questions");
      return;
    }

    await getPageContent();
    try {
      setLoadingAnswer(true);
      const res = await fetch('/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, questions }),
      })
      const { answer, error } = await res.json();
      if (answer) {
        setAnswer(answer);
      }
      if (error) {
        toast(error);
      }
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      toast("Something went wrong while fetching Result");
    } finally {
      setLoadingAnswer(false);
    }
  }


  const getPageContent = async () => {
    console.log("fetching content");

    try {
      setLoadingAnswer(true);
      if (!url || url.trim().length == 0) {
        toast("Please enter a url");
        return;
      }
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

      if (!urlPattern.test(url)) {
        toast("Please enter a valid URL");
        return;
      }


      const res = await fetch('/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const { res_content, error } = await res.json();
      if (res_content) {
        setContent(res_content);
      }

      if (error) {
        toast(error);
      }
    } catch (error) {
      toast("Something went wrong while fetching Content");
    } finally {
      setLoadingAnswer(false);
    }
  };



  const getScreenshot = async (e: any) => {
    e.preventDefault();
    try {
      setLoadingImage(true);
      if (!url || url.trim().length == 0) {
        toast("Please enter a url");
        return;
      }
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

      if (!urlPattern.test(url)) {
        toast("Please enter a valid URL");
        return;
      }


      const res = await fetch('/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const { res_image, error } = await res.json();
      if (res_image) {
        setImage(res_image);
      }

      if (error) {
        toast(error);
      }
    } catch (error) {
      toast("Something went wrong while fetching Screentshot");
    } finally {
      setLoadingImage(false);
    }
  };


  const downloadImage = async () => {
    const base64Data = image.split(',')[1]; // remove "data:image/png;base64," part
    const byteCharacters = atob(base64Data);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: "image/png" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'downloaded-image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };




  return (
    <main className={`${poppins.className} w-full min-h-screen flex flex-col items-center p-8 bg-gradient-to-b from-[#09090B] to-blue-600 text-[#FAFAFA]`}>

      <motion.div
        className="w-full flex items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className='w-full flex justify-center shadow-lg'

        >
          <motion.input
            whileHover={{ scale: 1.02 }}
            type="text"
            ref={urlRef}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            className="w-full md:w-1/4 py-2 px-4 border border-blue-300 rounded-md outline-0 shadow-lg bg-[#1F1F1F] text-white"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full mt-10 flex flex-col md:flex-row gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >

        <motion.div
          className="w-full md:w-1/2 border border-blue-300 bg-[#09090B] h-[700px] p-4 rounded-md shadow-md flex flex-col"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className='flex justify-between'>
            <Button
              disabled={loadingImage}
              onClick={getScreenshot}
              className="px-4 py-2 rounded-sm shadow cursor-pointer hover:scale-105 transition border border-blue-600 hover:text-blue-400"
            >
              Get Screenshot
            </Button>
            <Button
              onClick={downloadImage}
              className="px-4 py-2 rounded-sm shadow cursor-pointer hover:scale-105 transition border border-blue-600 hover:text-blue-400"
            >
              Download Screenshot
              <DownloadIcon />
            </Button>
          </div>

          <div className="w-full h-full mt-4 overflow-y-auto rounded-lg bg-[#1f1f1f] p-2">
            {loadingImage ? <Skeleton className="w-full h-[600px] rounded" /> : (
              (!image ? "Get Web Screenshot here." : <img src={image} alt="Web image" className="w-full object-cover rounded-md" />)
            )}
          </div>
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 border bg-[#09090B] border-blue-300 text-gray-300 h-[700px] p-4 rounded-md shadow-md flex flex-col"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex gap-2 items-center justify-between ">
            <input
              type="text"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="Ask Questions related to the page"
              className="py-2 px-4 border border-blue-600 outline-0 rounded-md w-3/4 text-gray-300"
            />
            <Button
              disabled={loadingAnswer}
              onClick={sendToGemini}
              className="text-white px-4 py-2 rounded-sm cursor-pointer hover:scale-105 transition border border-blue-600 hover:text-blue-400"
            >
              Get Answer
            </Button>

            <span className='cursor-pointer'>
              <CopyIcon onClick={async () => {
                const text = contentRef.current?.innerText;
                if (!text || text.trim().length == 0) {
                  toast("No text found");
                  return;
                }
                await navigator.clipboard.writeText(text);
                toast("answer copied to the clipboard!")
              }} className=' hover:text-blue-600 transition' />
            </span>
          </div>

          <div className="flex-1 mt-6 overflow-y-auto bg-[#1f1f1f] text-white p-4 rounded-lg">
            {loadingAnswer ? <div className="space-y-2">
              <Skeleton className="w-[80%] h-[20px] rounded-full" />
              <Skeleton className="w-[90%] h-[20px] rounded-full" />
              <Skeleton className="w-[75%] h-[20px] rounded-full" />
              <Skeleton className="w-[60%] h-[20px] rounded-full" />
            </div> : (
              <div
                ref={contentRef}
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: answer }}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
