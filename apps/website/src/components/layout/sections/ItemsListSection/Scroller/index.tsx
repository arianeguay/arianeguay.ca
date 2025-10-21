"use client";
import { ItemsList } from "apps/website/src/types/shared";

import React from "react";
import Card from "../Card";
import { ScrollerContainer, ScrollerRow } from "./styles";

const Scroller: React.FC<ItemsList> = ({ itemsCollection }) => {
  const baseItems = itemsCollection?.items ?? [];

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const baseMeasureRef = React.useRef<HTMLDivElement | null>(null);
  const [groupItems, setGroupItems] =
    React.useState<typeof baseItems>(baseItems);

  React.useEffect(() => {
    const containerEl = containerRef.current;
    const baseEl = baseMeasureRef.current;
    if (!containerEl || !baseEl) return;
    if (!baseItems.length) return;

    const containerWidth = containerEl.clientWidth;
    const baseWidth = baseEl.scrollWidth;
    if (baseWidth === 0) return;

    const repeats = Math.max(1, Math.ceil(containerWidth / baseWidth));
    const filledGroup: typeof baseItems = Array.from({
      length: repeats,
    }).flatMap(() => baseItems);
    setGroupItems(filledGroup);
  }, [baseItems]);

  const displayItems = React.useMemo(() => {
    if (!groupItems.length) return [] as typeof groupItems;
    return [...groupItems, ...groupItems];
  }, [groupItems]);

  return (
    <div style={{ position: "relative" }} ref={containerRef}>
      {/* hidden measurer for a single pass of base items */}
      <div
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
        ref={baseMeasureRef}
      >
        {baseItems.map((item, index) => (
          <span
            key={`measure-${index}`}
            style={{ display: "inline-block", marginRight: 16 }}
          >
            <Card text={item.text} noWrap />
          </span>
        ))}
      </div>

      <ScrollerContainer>
        <ScrollerRow $size={displayItems.length}>
          {displayItems.map((item, index) => (
            <Card key={index} text={item.text} noWrap />
          ))}
        </ScrollerRow>
      </ScrollerContainer>
    </div>
  );
};

export default Scroller;
