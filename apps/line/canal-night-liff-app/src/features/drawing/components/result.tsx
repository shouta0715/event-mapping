import { motion } from "framer-motion";
import { ArrowBigDownDash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResult } from "@/features/drawing/hooks/use-result";

type ResultCanvasProps = {
  result: Blob;
  onClear: () => void;
};

export const DrawResult = ({ result, onClear }: ResultCanvasProps) => {
  const { ref, scope, onDragEnd, onDrag, isPending, isSuccess } = useResult({
    result,
  });

  return (
    <div
      ref={ref}
      className="relative flex h-dvh flex-col items-center justify-center overflow-hidden"
    >
      <ArrowBigDownDash className="absolute bottom-4 left-1/2 size-20 -translate-x-1/2" />

      <motion.div
        ref={scope}
        className="relative mx-auto size-[300px] cursor-grab overflow-hidden rounded-full border-2 active:cursor-grabbing"
        drag="y"
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      >
        <img
          alt="Drawing result"
          className="pointer-events-none absolute inset-0 size-full"
          sizes="(min-width: 640px) 640px, 100vw"
          src={URL.createObjectURL(result)}
        />
      </motion.div>

      <div className="absolute right-10 top-0 mt-10 flex items-center gap-2">
        <p className="text-xs font-bold">
          ボールをしたにひっぱってボールをとばせ！
        </p>
        <Button
          disabled={isPending || isSuccess}
          onClick={onClear}
          size="sm"
          variant="destructive"
        >
          {isPending ? "アップロードちゅう..." : "かきなおす"}
        </Button>
      </div>
      {isSuccess && (
        <Button className="mt-6" onClick={onClear}>
          もういちどかく
        </Button>
      )}
    </div>
  );
};
