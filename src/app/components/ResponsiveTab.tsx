import {
	SvgIcon,
	Tab,
	TabProps,
	Tabs,
	TabsProps,
	useMediaQuery,
} from "@mui/material";
import React, { FunctionComponent, SVGProps } from "react";

export interface ResponsiveTabProps extends TabsProps {
	breakpoint: string;
	iconSVG?: boolean;
	tabProps?: TabProps;
	tabItems: {
		icon?:
			| TabProps["icon"]
			| FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
		label: React.ReactNode;
	}[];
}

export const ResponsiveTab = ({
	breakpoint,
	value,
	onChange,
	tabItems,
	iconSVG = false,
	...other
}: ResponsiveTabProps) => {
	const scroll = useMediaQuery(breakpoint);

	let tabsProps: TabsProps = { onChange, value };
	if (scroll) {
		tabsProps = {
			...tabsProps,
			variant: "fullWidth",
			centered: true,
			...other,
		};
	} else {
		tabsProps = {
			...tabsProps,
			variant: "scrollable",
			scrollButtons: true,
			allowScrollButtonsMobile: true,
			...other,
		};
	}

	return (
		<Tabs {...tabsProps}>
			{tabItems.map((item, index) => {
				
        return (
					<Tab
						key={index}
						icon={
							<SvgIcon
								component={item.icon as React.ElementType<any>}
								inheritViewBox
							/>
						}
						label={item.label}
						iconPosition='start'
					/>
				);
			})}
		</Tabs>
	);
};

// icon={iconSVG ? <SvgIcon component={item.icon as React.ElementType<any>} inheritViewBox /> : item.icon}
