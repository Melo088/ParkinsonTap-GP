import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Chip,
} from "@mui/material";
import {
    ArrowBack,
    PictureAsPdf,
    Speed,
    Timeline,
    TrendingUp,
    Compress,
    Person,
    Science,
    Rotate90DegreesCcw,
} from "@mui/icons-material";
import { analysisService } from "../services/analysisService";
import GraphChart from "../components/GraphChart";

// ── Sub-components ────────────────────────────────────────────────────────────

const InfoCard = ({ title, icon, rows }) => (
    <Card
        elevation={0}
        sx={{ border: "1px solid #E2E8F0", borderRadius: 2.5, height: "100%" }}
    >
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                {React.cloneElement(icon, { sx: { fontSize: 18, color: "#1B4F8A" } })}
                <Typography
                    sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontWeight: 600,
                        fontSize: 15,
                        color: "#111827",
                    }}
                >
                    {title}
                </Typography>
            </Box>
            {rows
                .filter(([, v]) => v != null && v !== "")
                .map(([label, value]) => (
                    <Box key={label} sx={{ display: "flex", gap: 1.5, mb: 1 }}>
                        <Typography
                            sx={{
                                fontFamily: '"DM Sans", sans-serif',
                                fontSize: 12,
                                color: "#9CA3AF",
                                minWidth: 120,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                fontWeight: 500,
                                flexShrink: 0,
                            }}
                        >
                            {label}
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: '"DM Sans", sans-serif',
                                fontSize: 13,
                                color: "#374151",
                            }}
                        >
                            {value}
                        </Typography>
                    </Box>
                ))}
        </CardContent>
    </Card>
);

const MetricCard = ({ icon, label, value, unit }) => (
    <Card elevation={0} sx={{ border: "1px solid #E2E8F0", borderRadius: 2 }}>
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                {React.cloneElement(icon, { sx: { fontSize: 15, color: "#1B4F8A" } })}
                <Typography
                    sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: 10,
                        color: "#9CA3AF",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        lineHeight: 1.2,
                    }}
                >
                    {label}
                </Typography>
            </Box>
            <Typography
                sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1,
                }}
            >
                {value != null ? Number(value).toFixed(3) : "—"}
                <Box
                    component="span"
                    sx={{ fontSize: 11, fontWeight: 400, color: "#9CA3AF", ml: 0.5 }}
                >
                    {unit}
                </Box>
            </Typography>
        </CardContent>
    </Card>
);

const SEVERITY_STYLES = {
    Normal:   { bg: "#F0FDF4", border: "#86EFAC", text: "#166534" },
    Leve:     { bg: "#FEF9C3", border: "#FDE047", text: "#713F12" },
    Moderado: { bg: "#FFF7ED", border: "#FDBA74", text: "#9A3412" },
    Severo:   { bg: "#FEF2F2", border: "#FECACA", text: "#991B1B" },
};

const SEVERITY_EXPLANATION = {
    Normal:   "Movimiento dentro de parámetros normales, sin indicadores de temblor significativo.",
    Leve:     "Se detecta temblor leve. Se recomienda seguimiento clínico periódico.",
    Moderado: "Temblor moderado presente. Evaluación clínica detallada recomendada.",
    Severo:   "Temblor severo detectado. Requiere atención médica especializada.",
};

// ── Main component ────────────────────────────────────────────────────────────

const AnalysisScreen = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const reportRef = useRef(null);

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        if (!testId) {
            setError("ID de test no proporcionado.");
            setLoading(false);
            return;
        }
        analysisService
            .fetchAnalysis(testId)
            .then(setAnalysis)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [testId]);

    const handleExportPDF = async () => {
        if (!reportRef.current || !analysis) return;
        setExporting(true);
        try {
            const { default: html2canvas } = await import("html2canvas");
            const { default: jsPDF } = await import("jspdf");
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#F0F4F8",
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            const imgH = (canvas.height * pageW) / canvas.width;
            let remaining = imgH;
            let position = 0;
            pdf.addImage(imgData, "PNG", 0, position, pageW, imgH);
            remaining -= pageH;
            while (remaining > 0) {
                position -= pageH;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pageW, imgH);
                remaining -= pageH;
            }
            const name = (analysis.patientName ?? "paciente").replace(/\s+/g, "-");
            pdf.save(`informe-${name}-${testId}.pdf`);
        } catch (e) {
            console.error("Error exportando PDF:", e);
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <CircularProgress sx={{ color: "#1B4F8A" }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ pt: 8, textAlign: "center" }}>
                <Typography sx={{ fontFamily: '"DM Sans"', color: "#DC2626", fontSize: 16 }}>
                    {error}
                </Typography>
                <Button onClick={() => navigate("/tests")} sx={{ mt: 2, fontFamily: '"DM Sans"' }}>
                    Volver a tests
                </Button>
            </Container>
        );
    }

    const sev = SEVERITY_STYLES[analysis?.tremorSeverity] ?? SEVERITY_STYLES.Normal;

    const formatDate = (dt) => {
        if (!dt) return "—";
        return new Date(dt).toLocaleString("es-ES", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    };

    return (
        <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#F0F4F8", pb: 10 }}>
            <Container maxWidth="xl" sx={{ pt: 6 }}>

                {/* ── Nav + export ── */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/tests")}
                        sx={{
                            fontFamily: '"DM Sans"', fontWeight: 500, textTransform: "none",
                            color: "#374151", "&:hover": { bgcolor: "#E2E8F0" },
                        }}
                    >
                        Volver a tests
                    </Button>
                    <Button
                        startIcon={<PictureAsPdf />}
                        onClick={handleExportPDF}
                        disabled={exporting}
                        sx={{
                            fontFamily: '"DM Sans"', fontWeight: 600, textTransform: "none",
                            bgcolor: "#1B4F8A", color: "#fff", px: 3, borderRadius: 2,
                            "&:hover": { bgcolor: "#153D6B" },
                            "&:disabled": { bgcolor: "#93C5FD", color: "#fff" },
                        }}
                    >
                        {exporting ? "Exportando…" : "Exportar PDF"}
                    </Button>
                </Box>

                {/* ── Printable region ── */}
                <Box ref={reportRef} sx={{ bgcolor: "#F0F4F8" }}>

                    {/* 1. Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            sx={{
                                fontFamily: '"DM Sans"', fontSize: 28, fontWeight: 700,
                                color: "#111827", letterSpacing: "-0.5px",
                            }}
                        >
                            Informe de Evaluación
                        </Typography>
                        <Typography
                            sx={{ fontFamily: '"DM Sans"', fontSize: 15, color: "#6B7280", mt: 0.5 }}
                        >
                            {analysis?.patientName} · {formatDate(analysis?.testDateTime)}
                        </Typography>
                    </Box>

                    {/* 2. Patient + Test cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={6}>
                            <InfoCard
                                title="Datos del Paciente"
                                icon={<Person />}
                                rows={[
                                    ["Nombre",    analysis?.patientName],
                                    ["Edad",      analysis?.patientAge ? `${analysis.patientAge} años` : null],
                                    ["Género",    analysis?.patientGender],
                                    ["Tipo",      analysis?.evaluatedType],
                                    ["IMC",       analysis?.patientBmi ? `${analysis.patientBmi} kg/m²` : null],
                                    ["Notas",     analysis?.patientNotes],
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoCard
                                title="Datos del Test"
                                icon={<Science />}
                                rows={[
                                    ["Test",         analysis?.testName],
                                    ["Descripción",  analysis?.testDescription],
                                    ["Lado evaluado",analysis?.evalAxis ? "Izquierdo" : "Derecho"],
                                    ["Doctor",       analysis?.doctorFullName],
                                    ["Especialidad", analysis?.doctorSpeciality],
                                    ["Centro",       analysis?.doctorMedicalCenter],
                                ]}
                            />
                        </Grid>
                    </Grid>

                    {/* 3. Metrics grid */}
                    <Typography
                        sx={{
                            fontFamily: '"DM Sans"', fontSize: 17, fontWeight: 600,
                            color: "#111827", mb: 2,
                        }}
                    >
                        Métricas de Movimiento
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {[
                            { icon: <Speed />,                  label: "RMS Dinámico (√σ²)", value: analysis?.tremorRms,          unit: "m/s²" },
                            { icon: <Speed />,                  label: "RMS Total (c/grav.)",value: analysis?.rmsTotal,            unit: "m/s²" },
                            { icon: <Speed />,                  label: "RMS Eje X",          value: analysis?.rmsX,                unit: "m/s²" },
                            { icon: <Speed />,                  label: "RMS Eje Y",          value: analysis?.rmsY,                unit: "m/s²" },
                            { icon: <Speed />,                  label: "RMS Eje Z",          value: analysis?.rmsZ,                unit: "m/s²" },
                            { icon: <Timeline />,               label: "Desv. Est. X",       value: analysis?.stdX,                unit: "m/s²" },
                            { icon: <Timeline />,               label: "Desv. Est. Y",       value: analysis?.stdY,                unit: "m/s²" },
                            { icon: <Timeline />,               label: "Desv. Est. Z",       value: analysis?.stdZ,                unit: "m/s²" },
                            { icon: <Compress />,               label: "Rango X",            value: analysis?.rangeX,              unit: "m/s²" },
                            { icon: <Compress />,               label: "Rango Y",            value: analysis?.rangeY,              unit: "m/s²" },
                            { icon: <Compress />,               label: "Rango Z",            value: analysis?.rangeZ,              unit: "m/s²" },
                            { icon: <TrendingUp />,             label: "Amplitud Pico-Pico", value: analysis?.peakToPeakMagnitude, unit: "m/s²" },
                            { icon: <Rotate90DegreesCcw />,     label: "Desv. Est. Yaw",     value: analysis?.stdYaw,              unit: "°" },
                            { icon: <Rotate90DegreesCcw />,     label: "Desv. Est. Pitch",   value: analysis?.stdPitch,            unit: "°" },
                            { icon: <Rotate90DegreesCcw />,     label: "Desv. Est. Roll",    value: analysis?.stdRoll,             unit: "°" },
                        ].map((m, i) => (
                            <Grid item xs={6} sm={4} md={3} key={i}>
                                <MetricCard {...m} />
                            </Grid>
                        ))}
                    </Grid>

                    {/* 4. Clinical interpretation */}
                    <Box
                        sx={{
                            mb: 4, p: 3,
                            bgcolor: sev.bg,
                            border: `1px solid ${sev.border}`,
                            borderRadius: 2,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                            <Typography
                                sx={{
                                    fontFamily: '"DM Sans"', fontSize: 15,
                                    fontWeight: 600, color: sev.text,
                                }}
                            >
                                Interpretación Clínica
                            </Typography>
                            <Chip
                                label={analysis?.tremorSeverity}
                                size="small"
                                sx={{
                                    bgcolor: sev.border, color: sev.text,
                                    fontWeight: 700, fontFamily: '"DM Sans"', fontSize: 12,
                                }}
                            />
                        </Box>
                        <Typography
                            sx={{ fontFamily: '"DM Sans"', fontSize: 13, color: sev.text }}
                        >
                            Índice de Temblor:{" "}
                            <strong>{analysis?.tremorIndex?.toFixed(1)}</strong> / 100 ·{" "}
                            RMS dinámico: <strong>{analysis?.tremorRms?.toFixed(3)} m/s²</strong>
                            {" · "}{SEVERITY_EXPLANATION[analysis?.tremorSeverity]}
                        </Typography>
                        <Typography
                            sx={{ fontFamily: '"DM Sans"', fontSize: 11, color: sev.text, mt: 1, opacity: 0.7 }}
                        >
                            * El índice se calcula sobre la aceleración dinámica (sin gravedad) como √(σx²+σy²+σz²).
                            Los umbrales son orientativos y requieren calibración clínica con este protocolo específico.
                        </Typography>
                    </Box>

                    {/* 5. Charts */}
                    {analysis?.readings?.length > 0 && (
                        <>
                            <Typography
                                sx={{
                                    fontFamily: '"DM Sans"', fontSize: 17, fontWeight: 600,
                                    color: "#111827", mb: 2,
                                }}
                            >
                                Gráficas del Sensor
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={6}>
                                    <GraphChart
                                        data={analysis.readings}
                                        title="Acelerómetro"
                                        dataKeys={[
                                            { key: "ax", axis: "left", color: "#1B4F8A" },
                                            { key: "ay", axis: "left", color: "#DC2626" },
                                            { key: "az", axis: "left", color: "#059669" },
                                        ]}
                                        yAxisLabelLeft="Aceleración (m/s²)"
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <GraphChart
                                        data={analysis.readings}
                                        title="Giroscopio — Roll, Pitch y Yaw"
                                        dataKeys={[
                                            { key: "p", axis: "left", color: "#D97706" },
                                            { key: "r", axis: "left", color: "#7C3AED" },
                                            { key: "y", axis: "left", color: "#DC2626" },
                                        ]}
                                        yAxisLabelLeft="Ángulo (°)"
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <GraphChart
                                        data={analysis.readings}
                                        title="Aceleración X y Roll"
                                        dataKeys={[
                                            { key: "ax", axis: "left",  color: "#1B4F8A" },
                                            { key: "r",  axis: "right", color: "#7C3AED" },
                                        ]}
                                        yAxisLabelLeft="Aceleración (m/s²)"
                                        yAxisLabelRight="Ángulo (°)"
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <GraphChart
                                        data={analysis.readings}
                                        title="Aceleración Y y Pitch"
                                        dataKeys={[
                                            { key: "ay", axis: "left",  color: "#DC2626" },
                                            { key: "p",  axis: "right", color: "#D97706" },
                                        ]}
                                        yAxisLabelLeft="Aceleración (m/s²)"
                                        yAxisLabelRight="Ángulo (°)"
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <GraphChart
                                        data={analysis.readings}
                                        title="Aceleración Z y Yaw"
                                        dataKeys={[
                                            { key: "az", axis: "left",  color: "#059669" },
                                            { key: "y",  axis: "right", color: "#DC2626" },
                                        ]}
                                        yAxisLabelLeft="Aceleración (m/s²)"
                                        yAxisLabelRight="Ángulo (°)"
                                    />
                                </Grid>
                            </Grid>
                        </>
                    )}

                    {/* Footer */}
                    <Box sx={{ mt: 6, pt: 3, borderTop: "1px solid #E2E8F0", textAlign: "center" }}>
                        <Typography sx={{ fontFamily: '"DM Sans"', fontSize: 11, color: "#9CA3AF" }}>
                            Generado por ParkinsonTap-GP · {new Date().toLocaleDateString("es-ES")}
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default AnalysisScreen;
