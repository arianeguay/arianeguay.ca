import { BackgroundSplash } from "apps/website/src/types/shared";
import { Fragment } from "react";

interface BackgroundSplashesProps {
  data: BackgroundSplash[];
}
const splashPercent = (number?: number | null) => {
  return `${number ?? 0}%`;
};
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
              left:
                splash.side === "left"
                  ? splashPercent(splash.margin)
                  : undefined,
              right:
                splash.side === "right"
                  ? splashPercent(splash.margin)
                  : undefined,
              top: splashPercent(splash.top),
              position: "absolute",
              zIndex: -1,
              userSelect: "none",
            }}
          />
        );
      })}
    </>
  );
};
export default BackgroundSplashesComponent;
