import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function SavingOverlay() {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-black bg-opacity-25">
      <div className="flex items-center gap-2 rounded-xl bg-background px-6 py-4">
        <LoadingSpinner />
        <p>Saving...</p>
      </div>
    </div>
  );
}
