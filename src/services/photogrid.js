export default function PhotoGrid({ photos, label }) {
    if (!photos?.length) {
      return <p className="text-sm text-slate-400">No {label.toLowerCase()} photos</p>;
    }
  
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((src, index) => (
          <img
            key={`${label}-${index}`}
            src={src}
            alt={`${label} ${index + 1}`}
            className="h-36 w-full rounded-lg border border-slate-200 object-cover"
          />
        ))}
      </div>
    );
  }