import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';


const GraphChart = ({ 
  data, 
  title, 
  dataKeys, // [{ key: 'ax', axis: 'left', color: '#1976d2' }, { key: 'r', axis: 'right', color: '#f44336' }]
  yAxisLabelLeft = 'Valor',
  yAxisLabelRight = 'Valor',
  loading = false 
}) => {
  const theme = useTheme();


  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
          height: 400
        }}
      >
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="body1" color="text.secondary">
              Cargando datos de {title.toLowerCase()}...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
          height: 400
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="80%"
          >
            <Typography variant="body2" color="text.secondary">
              No hay datos disponibles para mostrar
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const dataInSeconds = data.map(item => ({
    ...item,
    timestamp: item.timestamp / 1000
  }));

  return (

    <Card
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 3
      }}
    >
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 3
          }}
        >
          {title}
        </Typography>
        
        <Box sx={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataInSeconds} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />

              <XAxis 
                dataKey="timestamp" 
                stroke={theme.palette.text.secondary}
                fontSize={12}
                axisLine={{ stroke: alpha(theme.palette.divider, 0.5) }}
                tickLine={{ stroke: alpha(theme.palette.divider, 0.5) }}
                label={{ 
                  value: 'Tiempo (s)', 
                  position: 'insideBottom', 
                  offset: -10,
                  style: { textAnchor: 'middle', fill: theme.palette.text.secondary }
                }}
              />

              {/* Eje Y izquierdo */}
              <YAxis 
                yAxisId="left"
                orientation="left"
                stroke={theme.palette.text.secondary}
                fontSize={12}
                axisLine={{ stroke: alpha(theme.palette.divider, 0.5) }}
                tickLine={{ stroke: alpha(theme.palette.divider, 0.5) }}
                label={{ 
                  value: yAxisLabelLeft, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: theme.palette.text.secondary }
                }}
              />

              {/* Eje Y derecho */}
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke={theme.palette.text.secondary}
                fontSize={12}
                axisLine={{ stroke: alpha(theme.palette.divider, 0.5) }}
                tickLine={{ stroke: alpha(theme.palette.divider, 0.5) }}
                label={{ 
                  value: yAxisLabelRight, 
                  angle: 90, 
                  position: 'insideRight',
                  style: { textAnchor: 'middle', fill: theme.palette.text.secondary }
                }}
              />

              <Tooltip 
                contentStyle={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  borderRadius: 8,
                  boxShadow: theme.shadows[4]
                }}
                labelStyle={{ color: theme.palette.text.primary }}
              />

              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  color: theme.palette.text.primary
                }}
              />

              {/* Líneas */}
              {dataKeys.map((entry, index) => {
                const key = typeof entry === 'string' ? entry : entry.key;
                const axis = typeof entry === 'string' ? 'left' : entry.axis || 'left';
                const color = entry.color || ['#1976d2', '#dc004e', '#2e7d32'][index % 3];

                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    yAxisId={axis}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ 
                      r: 4, 
                      fill: color,
                      stroke: theme.palette.background.paper,
                      strokeWidth: 2
                    }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GraphChart;
