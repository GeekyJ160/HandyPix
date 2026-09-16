import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Camera, ImagePlus, LoaderCircle, Plus, RotateCcw, Video, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/input";
import { diagnosePhoto } from "@/lib/handypix-api";
import { CATEGORY_LABEL, SAMPLE_SCANS, type Category } from "@/lib/handypix-types";
import { fileToDataUrl, urlToDataUrl } from "@/lib/image";
import { queryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";

type ScanSearch = {
  mode?: "upload" | "video" | "camera";
  category?: Category;
};

export const Route = createFileRoute("/scan")({
  component: ScanPage,
  validateSearch: (search: Record<string, unknown>): ScanSearch => ({
    mode:
      search.mode === "upload" || search.mode === "video" || search.mode === "camera"
        ? search.mode
        : undefined,
    category: typeof search.category === "string" ? (search.category as Category) : undefined,
  }),
});

const STAGES = [
  "Reading the photo",
  "Identifying the failure",
  "Estimating parts and labor",
];

function ScanPage() {
  return (
    <AppShell>
      <ScanBody />
    </AppShell>
  );
}

function ScanBody() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (search.mode === "upload") fileRef.current?.click();
    if (search.mode === "camera" || search.mode === "video") cameraRef.current?.click();
  }, [search.mode]);

  const mutate = useMutation({
    mutationFn: async () => {
      const timer = window.setInterval(
        () => setStage((s) => Math.min(s + 1, STAGES.length - 1)),
        1400,
      );
      try {
        const hint = search.category
          ? `Likely trade: ${CATEGORY_LABEL[search.category]}. ${notes}`
          : notes;
        return await diagnosePhoto({
          data: {
            imageDataUrl: photos[0],
            extraPhotos: photos.slice(1),
            notes: hint,
          },
        });
      } finally {
        window.clearInterval(timer);
      }
    },
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.error);
        setStage(0);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["diagnoses"] });
      void navigate({ to: "/diagnosis/$id", params: { id: res.diagnosis.id } });
    },
    onError: () => {
      toast.error("Diagnosis failed. Try another photo.");
      setStage(0);
    },
  });

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.type.startsWith("video/")) {
      toast.message("Still frames diagnose better — grab a photo of the problem.");
      return;
    }
    try {
      const url = await fileToDataUrl(file);
      setPhotos((prev) => [...prev, url].slice(0, 4));
    } catch {
      toast.error("Could not read that photo");
    }
  }

  async function handleSample(src: string) {
    try {
      const url = await urlToDataUrl(src);
      setPhotos([url]);
    } catch {
      toast.error("Could not load sample");
    }
  }

  const preview = photos[0] ?? null;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Show us the problem
      </h1>
      <p className="mt-1 text-sm text-muted">
        Tip: take a close-up and a wider photo of where it sits.
      </p>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      <button
        type="button"
        onClick={() => cameraRef.current?.click()}
        className={cn(
          "mt-6 flex w-full flex-col items-center justify-center overflow-hidden rounded-[28px] bg-surface shadow-[var(--shadow-border)]",
          preview ? "p-2" : "min-h-56 p-8",
        )}
      >
        {preview ? (
          <img
            src={preview}
            alt="Selected problem"
            className="max-h-80 w-full rounded-[20px] object-cover"
          />
        ) : (
          <>
            <span className="grid size-14 place-items-center rounded-full bg-accent-dim text-accent">
              <Camera className="size-6" />
            </span>
            <span className="mt-3 font-display font-semibold">Take photo</span>
            <span className="mt-1 text-sm text-muted">or upload from the library</span>
          </>
        )}
      </button>

      {photos.length > 1 ? (
        <div className="mt-3 flex gap-2">
          {photos.map((src, i) => (
            <button
              key={src.slice(0, 24) + i}
              type="button"
              onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
              className="relative"
            >
              <img src={src} alt="" className="size-16 rounded-[12px] object-cover" />
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-surface-2">
                <X className="size-3" />
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-3 grid grid-cols-2 gap-2">
        {preview ? (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setPhotos([]);
                cameraRef.current?.click();
              }}
            >
              <RotateCcw className="size-4" />
              Retake
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={photos.length >= 4}
              onClick={() => cameraRef.current?.click()}
            >
              <Plus className="size-4" />
              Add photo
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="secondary" onClick={() => cameraRef.current?.click()}>
              <Camera className="size-4" />
              Camera
            </Button>
            <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
              <ImagePlus className="size-4" />
              Upload
            </Button>
          </>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        className="mt-1 w-full"
        onClick={() => cameraRef.current?.click()}
      >
        <Video className="size-4" />
        Add video still
      </Button>

      <div className="mt-6">
        <Label htmlFor="notes">What are you seeing? (optional)</Label>
        <Textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Drips when the handle is off. Started last week."
        />
      </div>

      <Button
        className="mt-4 w-full"
        size="lg"
        disabled={!preview || mutate.isPending}
        onClick={() => preview && mutate.mutate()}
      >
        {mutate.isPending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            {STAGES[stage]}
          </>
        ) : (
          "Diagnose with AI"
        )}
      </Button>

      <section className="mt-10">
        <h2 className="text-sm font-semibold">Try a sample</h2>
        <p className="mt-1 text-xs text-subtle">
          No camera needed — these still run a real diagnosis.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SAMPLE_SCANS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => void handleSample(s.src)}
              className="overflow-hidden rounded-[16px] bg-surface text-left shadow-[var(--shadow-border)]"
            >
              <img src={s.src} alt={s.label} className="aspect-[4/3] w-full object-cover" />
              <span className="block px-2 py-2 text-xs">{s.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
