import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function loading() {
  return (
    <Dialog open>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Configure Availbility</DialogTitle>
          <DialogDescription>
            Set your avialable timeslot for particular dates
          </DialogDescription>
        </DialogHeader>
        <div className="aspect-w-16 aspect-h-9" />
      </DialogContent>
    </Dialog>
  );
}
