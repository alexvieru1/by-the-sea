import Image from 'next/image';

interface PlaceholderImageProps {
  label: string;
  className?: string;
  src?: string;
  alt?: string;
}

export default function PlaceholderImage({
  label,
  className,
  src,
  alt,
}: PlaceholderImageProps) {
  const containerClass = `relative w-full overflow-hidden bg-gray-200 ${className ?? 'aspect-[4/3]'}`;

  if (src) {
    return (
      <div className={containerClass}>
        <Image
          src={src}
          alt={alt ?? label}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium uppercase tracking-wider text-gray-400">
          Photo: {label}
        </span>
      </div>
    </div>
  );
}
