import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import {
  ErrorOutline as ErrorOutlineIcon,
  WarningAmber as WarningAmberIcon,
} from "@mui/icons-material";

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Eliminar",
  onConfirm,
  onCancel,
  severity = "danger",
}) => {
  const isDanger = severity === "danger";

  const icon = isDanger ? (
    <ErrorOutlineIcon sx={{ color: "#DC2626", fontSize: 22 }} />
  ) : (
    <WarningAmberIcon sx={{ color: "#D97706", fontSize: 22 }} />
  );

  const confirmColor = isDanger ? "#DC2626" : "#D97706";
  const confirmHover = isDanger ? "#B91C1C" : "#B45309";
  const confirmBgHover = isDanger ? "#FEF2F2" : "#FFFBEB";

  return (
    <Dialog
      open={open}
      onClose={isDanger ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          border: "1px solid #E2E8F0",
          boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 1,
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 16,
          fontWeight: 600,
          color: "#111827",
        }}
      >
        {icon}
        {title}
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <DialogContentText
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13,
            color: "#4B5563",
            lineHeight: 1.6,
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onCancel}
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13,
            fontWeight: 400,
            color: "#4B5563",
            textTransform: "none",
            border: "1px solid #E2E8F0",
            borderRadius: 1.5,
            px: 2,
            height: 38,
            "&:hover": { bgcolor: "#F0F4F8" },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13,
            fontWeight: 500,
            color: confirmColor,
            textTransform: "none",
            border: `1px solid ${confirmColor}`,
            borderRadius: 1.5,
            px: 2,
            height: 38,
            bgcolor: "transparent",
            "&:hover": { bgcolor: confirmBgHover, borderColor: confirmHover, color: confirmHover },
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
