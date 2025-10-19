import { BackgroundSplash } from "apps/website/src/types/shared";
import { Fragment } from "react";

interface BackgroundSplashesProps {
  data: BackgroundSplash[];
}
const BackgroundSplashesComponent: React.FC<BackgroundSplashesProps> = ({
  data,
}) => {
  return (
    <>
      {data.map((splash) => {
        if (!splash.asset)
          return (
            <Fragment
              key={["splash", splash.side, splash.top, splash.margin]
                .filter(Boolean)
                .join("-")}
            />
          );

        return (
          <img
            key={["splash", splash.side, splash.top, splash.margin]
              .filter(Boolean)
              .join("-")}
            src={splash.asset?.url}
            alt={splash.asset?.title ?? ""}
            style={{
              left: splash.side === "left" ? (splash.margin ?? "") : "",
              right: splash.side === "right" ? (splash.margin ?? "") : "",
              top: splash.top ?? "",
              position: "absolute",
              zIndex: 0,
              userSelect: "none",
            }}
          />
        );
      })}
    </>
  );
};
export default BackgroundSplashesComponent;
