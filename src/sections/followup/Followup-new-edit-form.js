"use client";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useEffect } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

import { useRouter } from "src/routes/hooks";
import { useSnackbar } from "src/components/snackbar";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import { CreateFollowUp, UpdateFollowUp } from "src/api/leads";
import dayjs from "dayjs";
import { useAuthContext } from "src/auth/hooks";

export default function FollowupForm({ currentUser, id }) {
    const Lead = currentUser?.lead_id || id;
    const Row = currentUser?.id;
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuthContext();
    const Token = user?.accessToken;

    const FollowupSchema = Yup.object().shape({
        followup_date: Yup.string().required("Follow-up Date is required"),
        summary: Yup.string().required("Summary is required"),
        followup_status: Yup.number().required("Status is required"),
    });

    const defaultValues = useMemo(
        () => ({
            lead_first_name: currentUser?.lead_first_name || "",
            lead_last_name: currentUser?.lead_last_name || "",
            followup_date: currentUser?.followup_date ? dayjs(currentUser.followup_date).format("DD-MM-YYYY") : null,
            summary: currentUser?.summary || "",
            followup_status: currentUser?.followup_status === 2 ? 2 : 1, // Default to "In Progress" (1), else "Completed" (2)
        }),
        [currentUser]
    );

    const methods = useForm({
        resolver: yupResolver(FollowupSchema),
        defaultValues,
    });

    const {
        reset,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        reset(defaultValues);
    }, [currentUser, reset, defaultValues]);

    const onSubmit = handleSubmit(async (data) => {
        const statusValue = data.followup_status === 1 ? 1 : 2;
        const formData = { ...data, followup_status: statusValue };
        console.log("dataas", formData);


        try {
            if (currentUser?.followup_date) {
                await UpdateFollowUp(Row, formData, Token);
                enqueueSnackbar("Follow-up information saved successfully!", { variant: "success" });
            } else {
                await CreateFollowUp(formData, Lead);
                enqueueSnackbar("Follow-up Created successfully!", { variant: "success" });
            }
            router.push(`/dashboard/followup?id=${Lead}`);
            reset();
        } catch (error) {
            enqueueSnackbar(error.message || "Unknown error", { variant: "error" });
        }
    });

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Card sx={{ p: 5, width: "100%" }}>
                    <Grid container spacing={3}>
                        <Grid xs={6}>
                            <RHFTextField
                                name="lead_first_name"
                                label="First Name"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid xs={6}>
                            <RHFTextField
                                name="lead_last_name"
                                label="Last Name"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid xs={6}>
                            <FormControl fullWidth>
                                <RHFTextField
                                    name="followup_date"
                                    label="Follow-up Date"
                                    type="date"
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                        <Grid xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Controller
                                    name="followup_status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} label="Status">
                                            <MenuItem value={1}>In Progress</MenuItem>
                                            <MenuItem value={2}>Completed</MenuItem>
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid xs={12}>
                            <RHFTextField
                                name="summary"
                                label="Summary"
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </Grid>

                    <Stack alignItems="flex-end" sx={{ mt: 4 }}>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            {currentUser?.followup_date ? "Save Changes" : "Create Followup"}
                        </LoadingButton>
                    </Stack>
                </Card>
            </FormProvider>
        </Box>
    );
}

FollowupForm.propTypes = {
    currentUser: PropTypes.object,
    id: PropTypes.string,
};
