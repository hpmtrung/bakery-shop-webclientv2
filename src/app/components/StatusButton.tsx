import { Button, ButtonProps, styled } from "@mui/material";
import React, { useCallback, useState } from "react";

const ColorButton = styled(Button, {
	shouldForwardProp: (prop) => prop !== "customStyle",
})<{ customStyle: any }>(({ theme, customStyle }) => ({
	color: theme.palette.getContrastText(customStyle.backgroundColor),
	backgroundColor: customStyle.backgroundColor,
	"&:hover": {
		color: theme.palette.getContrastText(customStyle.hover.backgroundColor),
		backgroundColor: customStyle.hover.backgroundColor,
	},
}));

export interface StatusButtonProps
	extends Omit<ButtonProps, "onMouseEnter" | "onMouseLeave"> {
	statuses: {
		statusId: number | string;
		icon?: JSX.Element;
		content: React.ReactNode;
		style: { backgroundColor: string };
	}[];
	currentStatusId: number | string;
	handleUpdateStatus: () => any;
}

const StatusButton = React.memo((props: StatusButtonProps) => {
	const {
		statuses,
		currentStatusId,
		variant = "contained",
		onClick,
		handleUpdateStatus,
		...other
	} = props;

	const [count, setCount] = useState(
		statuses.findIndex((s) => s.statusId === currentStatusId)
	);
	const [hoverable, setHoverable] = useState(true);
	const [hover, setHover] = useState(false);

	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			setCount(count + 1);
			setHoverable(false);
			setHover(false);
			onClick && onClick(e);
			handleUpdateStatus();
		},
		[count, onClick, handleUpdateStatus]
	);

	let extraProps = {};
	if (count < statuses.length - 1) {
		if (hoverable) {
			extraProps = {
				onMouseEnter: () => setHover(true),
				onMouseLeave: () => setHover(false),
				onClick: handleClick,
			};
		} else {
			extraProps = {
				onMouseLeave: () => setHoverable(true),
			};
		}
	}

	const icon = hover ? statuses[count + 1].icon : statuses[count].icon;
	const content = hover ? statuses[count + 1].content : statuses[count].content;
	const customStyle = {
		backgroundColor: statuses[count].style.backgroundColor,
		hover: {
			backgroundColor: hover
				? statuses[count + 1].style.backgroundColor
				: statuses[count].style.backgroundColor,
		},
	};
	if (icon) {
		extraProps = { ...extraProps, startIcon: icon };
	}
	return (
		<ColorButton
			customStyle={customStyle}
			variant={variant}
			{...extraProps}
			{...other}>
			{content}
		</ColorButton>
	);
});

export default StatusButton;
