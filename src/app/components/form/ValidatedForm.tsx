import { Box } from '@mui/material';
import React from 'react';
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormReset,
  UseFormReturn,
  ValidationMode,
} from 'react-hook-form';

export interface FormProps {
  children: React.ReactNode | React.ReactNode[];
  defaultValues: DefaultValues<FieldValues>;
  onSubmit: SubmitHandler<FieldValues>;
  mode?: keyof ValidationMode;
  [key: string]: any;
}

export interface FormRefObject {
  watchFields: UseFormReturn['watch'];
  reset: UseFormReset<FieldValues>;
}

export const ValidatedForm = React.forwardRef<FormRefObject, FormProps>(
  ({ defaultValues, children, onSubmit, mode, ...other }: FormProps, ref: React.Ref<FormRefObject>) => {
    const methods = useForm({ mode: mode || 'onTouched', defaultValues });
    const { handleSubmit, watch, reset } = methods;

    React.useImperativeHandle(ref, () => ({
      watchFields: watch,
      reset,
    }));

    return (
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate {...other}>
          {children}
        </Box>
      </FormProvider>
    );
  }
);
