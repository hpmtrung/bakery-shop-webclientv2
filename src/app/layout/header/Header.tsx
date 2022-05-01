import {
	AppBar,
	Box,
	Button,
	Container,
	Link,
	Toolbar,
	useScrollTrigger,
} from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/config/store";
import { setShowModalLogin } from "src/app/modules/auth/authentication.reducer";
import LoginModal from "src/app/modules/auth/LoginModal";
import { setLocale } from "src/app/shared/reducers/locale";
import { Storage } from "src/app/shared/util/storage-utils";
import AdminManagementMenu from "./menu/AdminManagementMenu";
import AuthenticatedUserMenu from "./menu/AuthenticatedUserMenu";
import CartMenu from "./menu/CartMenu";
import { LocaleMenu } from "./menu/LocaleMenu";
import MobileMenu from "./MobileMenu";
import BrandImage from 'src/assets/images/logo-light.png';

const BRAND_ICON_HEIGHT = 7;

const Brand = React.memo(() => (
	<Link
		component={RouterLink}
		to='/'
		sx={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			"& .brand-icon": {
				height: `${8 * BRAND_ICON_HEIGHT}px`,
				width: "auto",
			},
		}}>
		<img src={BrandImage} className='brand-icon' alt='Logo' />
	</Link>
));

const HEADER_PY = 1.5;
const HEADER_COLOR = "text.secondary";
const HEADER_BG_FILL = "background.paper";
const HEADER_BG_TRANSPARENT = "transparent";

export type IHeaderProps = {
	isAuthenticated: boolean;
	isAdmin: boolean;
	currentLocale: string;
};

const Header = ({ isAuthenticated, isAdmin, currentLocale }: IHeaderProps) => {
	const dispatch = useAppDispatch();
	// For trigger scrolling
	const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 30 });
	const elevationEffect = useAppSelector(
		(state) => state.header.elevationEffect
	);
	const headerBgColor = elevationEffect
		? trigger
			? HEADER_BG_FILL
			: HEADER_BG_TRANSPARENT
		: HEADER_BG_FILL;

	const handleLocaleChange = (event) => {
		const langKey = event.target.value;
		Storage.session.set("locale", langKey);
		dispatch(setLocale(langKey));
	};

	const handleOpenLoginModal = () => {
		dispatch(setShowModalLogin(true));
	};

	return (
		<>
			<AppBar
				elevation={trigger ? 4 : 0}
				sx={{
					flexGrow: 1,
					py: HEADER_PY,
					bgcolor: headerBgColor,
					color: HEADER_COLOR,
				}}>
				<Container maxWidth='lg'>
					<Toolbar disableGutters>
						{/* Logo */}
						<Brand />
						{/* Filling space */}
						<Box sx={{ flexGrow: 1 }} />
						{/* Menus */}
						<Box
							sx={{
								alignItems: "center",
								gap: 1,
								display: { xs: "none", md: "flex" },
							}}>
							{isAuthenticated && isAdmin && <AdminManagementMenu />}

							{isAuthenticated ? (
								<AuthenticatedUserMenu />
							) : (
								<Button
									variant='outlined'
									data-cy='login'
									disableElevation
									onClick={handleOpenLoginModal}>
									Login
								</Button>
							)}

							<CartMenu />
							<LocaleMenu
								currentLocale={currentLocale}
								onClick={handleLocaleChange}
								sx={{ textTransform: "none" }}
							/>
						</Box>
						<Box sx={{ display: { xs: "flex", md: "none" } }}>
							<MobileMenu isAuthenticated isAdmin />
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
			<LoginModal />
			{elevationEffect || (
				<Toolbar
					disableGutters
					sx={{ flexGrow: 1, padding: HEADER_PY + BRAND_ICON_HEIGHT - 3 }}
				/>
			)}
		</>
	);
};

export default Header;
