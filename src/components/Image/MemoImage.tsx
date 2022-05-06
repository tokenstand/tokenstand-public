import Image from "next/image";
import { useMemo } from "react";

const MemoImage = ({ src, width = "32px", height = "32px", alt = "image", ...rest }) => {
  const srcs = useMemo(() => {
    return src;
  }, [src]);
  return <Image {...rest} src={srcs} alt={alt} width={width} height={height} />;
};

export default MemoImage;
