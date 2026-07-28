import { ComponentType, lazy, Suspense, useEffect, useRef, useState } from "react";

interface DeferredSectionProps {
  loader: () => Promise<{ default: ComponentType }>;
  minHeight?: string;
  rootMargin?: string;
}

export const DeferredSection = ({
  loader,
  minHeight = "24rem",
  rootMargin = "300px 0px",
}: DeferredSectionProps) => {

  const [shouldRender, setShouldRender] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const LazyComponentRef = useRef(lazy(loader));

  useEffect(() => {
    if (shouldRender || !targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();

  }, [rootMargin, shouldRender]);


  return (
    <div 
      ref={targetRef}
      style={{
        minHeight,
        width:"100%",
        overflow:"hidden"
      }}
    >
      {shouldRender && (
        <Suspense 
          fallback={
            <div 
              style={{minHeight}}
              aria-hidden="true"
            />
          }
        >
          <LazyComponentRef.current />
        </Suspense>
      )}
    </div>
  );
};