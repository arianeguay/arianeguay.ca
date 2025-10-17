"use client";
import { ItemsList } from "apps/website/src/types/shared";

import React from "react";
import { ScrollerContainer, ScrollerRow } from "./styles";
import { DefaultCard } from "../Card";

const Scroller: React.FC<ItemsList> = ({ itemsCollection }) => {
  const baseItems = itemsCollection?.items ?? [];
  const displayItems = [...baseItems, ...baseItems, ...baseItems];

  return (
    <div style={{ position: "relative" }}>
      <ScrollerContainer>
        <ScrollerRow $size={displayItems.length}>
          {displayItems.map((item, index) => (
           <DefaultCard key={index} text={item.text} noWrap />
          ))}
        </ScrollerRow>
      </ScrollerContainer>
    </div>
  );
};

export default Scroller;
