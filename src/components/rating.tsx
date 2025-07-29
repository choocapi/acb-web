import { StarIcon } from "lucide-react";

export default function Rating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) =>
        rating >= index + 1 ? (
          <StarIcon fill="yellow" key={index} className="h-4 w-4" />
        ) : (
          <StarIcon fill="none" key={index} className="h-4 w-4" />
        )
      )}
    </div>
  );
}
