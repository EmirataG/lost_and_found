let googleMapsPromise: Promise<void> | null = null;

export function loadGoogleMaps(): Promise<void> {
  if (googleMapsPromise) return googleMapsPromise;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  googleMapsPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("Window is undefined");

    // If already loaded
    if (window.google?.maps) return resolve();

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
