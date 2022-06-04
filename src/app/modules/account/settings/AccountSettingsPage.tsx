import { LoadingButton } from "@mui/lab";
import { Grid, Paper } from "@mui/material";
import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import AvatarInput from "src/app/components/avatar-input/AvatarInput";
import ResetButton from "src/app/components/form/ResetButton";
import { ValidatedForm } from "src/app/components/form/ValidatedForm";
import { ValidatedInput } from "src/app/components/form/ValidatedInput";
import { ValidatedSelect } from "src/app/components/form/ValidatedSelect";
import { useAppDispatch, useAppSelector } from "src/app/config/store";
import { languages, locales } from "src/app/config/translation";
import { IUserAccount } from "src/app/modules/auth/model/account.model";
import Translate, { translate } from "src/app/shared/language/Translate";
import { saveAccountSettings } from "./account-settings.reducer";
import { IImageUpload } from "./model/settings.model";

export const AccountSettingsPage = () => {
	const dispatch = useAppDispatch();

	const account = useAppSelector((state) => state.authentication.account);
	const { loading } = useAppSelector((state) => state.settings);

	const [imageUpload, setImageUpload] = React.useState<IImageUpload>({
		file: null,
		previewURL: null,
	});

	useEffect(() => {
		if (!isEmpty(account)) {
			setImageUpload({
				file: null,
				previewURL: account.imageUrl,
			});
		}
	}, [account]);

	const handleSubmit = (data: IUserAccount) => {
		let formData = null;
		if (imageUpload.file) {
			formData = new FormData();
			formData.append("image", imageUpload.file);
		}
		dispatch(
			saveAccountSettings({
				account: {
					...account,
					...data,
				},
				formData,
			})
		);
	};

	const handleUpload = (data: IImageUpload) => {
		setImageUpload(data);
	};

	return (
		<Paper variant='outlined' sx={{ p: 5 }}>
			<ValidatedForm onSubmit={handleSubmit} defaultValues={account}>
				<Grid container justifyContent='center' spacing={2}>
					<Grid
						container
						item
						direction='column'
						xs={5}
						spacing={2}
						alignItems='center'
						justifyContent='center'>
						<Grid item>
							<AvatarInput
								alt='Avatar'
								src={imageUpload.previewURL}
								handleUpload={handleUpload}
								sx={{ width: 150, height: 150 }}
							/>
						</Grid>
					</Grid>
					<Grid container item xs={7} spacing={1}>
						<Grid container item spacing={1}>
							<Grid item xs={6}>
								<ValidatedInput
									name='firstName'
									type='text'
									label={translate("settings.form.firstname")}
									placeholder={translate("settings.form.firstname.placeholder")}
									rules={{
										required: translate(
											"settings.messages.validate.firstname.required"
										),
										minLength: {
											value: 1,
											message: translate(
												"settings.messages.validate.firstname.minlength"
											),
										},
										maxLength: {
											value: 50,
											message: translate(
												"settings.messages.validate.firstname.maxlength"
											),
										},
									}}
									fullWidth
								/>
							</Grid>
							<Grid item xs={6}>
								<ValidatedInput
									name='lastName'
									type='text'
									label={translate("settings.form.lastname")}
									placeholder={translate("settings.form.lastname.placeholder")}
									rules={{
										required: translate(
											"settings.messages.validate.lastname.required"
										),
										minLength: {
											value: 1,
											message: translate(
												"settings.messages.validate.lastname.minlength"
											),
										},
										maxLength: {
											value: 50,
											message: translate(
												"settings.messages.validate.lastname.maxlength"
											),
										},
									}}
									fullWidth
								/>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<ValidatedInput
								name='email'
								type='email'
								label='Email'
								placeholder='Your email'
								rules={{
									required: "Your email is required",
								}}
								fullWidth
								readOnly
							/>
						</Grid>
						<Grid container item spacing={1}>
							<Grid item xs={5}>
								<ValidatedInput
									name='phone'
									type='text'
									label='Phone'
									placeholder='Your phone'
									rules={{
										required: "Phone is required",
										pattern: {
											value: /^[\d]{10}$/,
											message: "Phone is invalid",
										},
									}}
									fullWidth
								/>
							</Grid>
							<Grid item xs={3}>
								<ValidatedSelect
									name='langKey'
									label={translate("settings.form.language")}
									options={locales.map((locale) => ({
										key: locale,
										value: languages[locale].name,
									}))}
									size='small'
									fullWidth
								/>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<ValidatedInput
								name='address'
								type='text'
								label='Address'
								placeholder='Your address'
								fullWidth
							/>
						</Grid>
						<Grid container item spacing={2}>
							<Grid item>
								<LoadingButton
									type='submit'
									loading={loading}
									loadingIndicator='save...'
									variant='contained'>
									<Translate contentKey='settings.form.button'>Save</Translate>
								</LoadingButton>
							</Grid>
							<Grid item>
								<ResetButton variant='contained' color='inherit'>
									Reset
								</ResetButton>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</ValidatedForm>
		</Paper>
	);
};

export default AccountSettingsPage;
