'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlayIcon } from 'lucide-react';
import { useState } from 'react';

export default function VideoPlayer({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-10 h-10 rounded-full p-0"
      >
        <PlayIcon className="w-4 h-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Video</DialogTitle>
          </DialogHeader>
          <div className="aspect-w-16 aspect-h-9">
            <video className="w-full h-full" controls>
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
