"use client";

import { Strikethrough } from "lucide-react";
import React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/ui/toolbars/toolbar-provider";
import { getModKey } from "@/lib/os";

const StrikeThroughToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, onClick, children, ...props }, ref) => {
		const { editor } = useToolbar();
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"h-8 w-8",
							editor?.isActive("strike") && "bg-accent",
							className,
						)}
						onClick={(e) => {
							editor?.chain().focus().toggleStrike().run();
							onClick?.(e);
						}}
						disabled={!editor?.can().chain().focus().toggleStrike().run()}
						ref={ref}
						{...props}
					>
						{children || <Strikethrough className="h-4 w-4" />}
					</Button>
				</TooltipTrigger>
        <TooltipContent>
          <p>Strikethrough ({getModKey()} + Shift + X)</p>
        </TooltipContent>
			</Tooltip>
		);
	},
);

StrikeThroughToolbar.displayName = "StrikeThroughToolbar";

export { StrikeThroughToolbar };
