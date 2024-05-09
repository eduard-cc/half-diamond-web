import { useState, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export default function CopyToClipboardButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const triggerRef = useRef(null);

  const handleCopy = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild ref={triggerRef} onClick={handleCopy}>
          <Button
            variant="link"
            className="w-fit p-0 text-sm font-normal"
            size="sm"
          >
            {text}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          onPointerDownOutside={(event) => {
            if (event.target === triggerRef.current) event.preventDefault();
          }}
        >
          <div className="flex items-center">
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-muted-foreground" />
                <p>Copied to clipboard</p>
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4 text-muted-foreground" />
                <p>Copy to clipboard</p>
              </>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
