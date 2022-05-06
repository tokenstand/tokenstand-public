import { useEffect, useRef, useState } from "react";

export const LazyImage = ({src, height, className}) => {
    const rootRef = useRef();
    const [isVisible, setIsVisible] = useState(false);
    const loading = '/images/nft-default.png';
  
    useEffect(() => {
      const defaultIntersectionOptions = {
        threshold: 0,
        rootMargin: '0px',
      };
      
      const checkIntersections = entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      };
  
      if (!isVisible) {
        const newIO = new IntersectionObserver(checkIntersections, defaultIntersectionOptions);
        newIO.observe(rootRef.current);
        return () => newIO.disconnect();
      }
    }, [isVisible]);
  
      return (
       <img height={height} src={isVisible ? src : loading} ref={rootRef} className={className}/>
      );
  };