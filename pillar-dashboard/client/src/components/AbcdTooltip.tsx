import React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

function AbcdLabel() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="underline decoration-dotted cursor-help">ABCD</span>
      </TooltipTrigger>
      <TooltipContent>Approved / Blocked / Changed / Delivered</TooltipContent>
    </Tooltip>
  );
}

function renderWithAbcd(text: string): React.ReactNode {
  const idx = text.indexOf("ABCD");
  if (idx === -1) return text;

  const before = text.slice(0, idx);
  const after = text.slice(idx + 4);

  return (
    <>
      {before}
      <AbcdLabel />
      {after}
    </>
  );
}

export { AbcdLabel, renderWithAbcd };
