import { useState } from 'react';
import { TextField as MuiTextField } from '@mui/material';
import { TextField as TextFieldVE } from '../ui/TextField/TextField';
import { Box, Stack, Typography, Button } from '@mui/material';

/**
 * Diagnostic page for comparing MUI TextField with TextField VE
 * Used to measure DOM metrics and validate visual alignment
 */
export function TextFieldDiagnostic() {
  const [valueDefault, setValueDefault] = useState('');
  const [valueFocused, setValueFocused] = useState('');
  const [valueFilled, setValueFilled] = useState('Filled value');
  const [valueError, setValueError] = useState('Error value');
  const [valueDisabled, setValueDisabled] = useState('Disabled value');

  const measureLabel = (containerId: string) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const label = container.querySelector('label');
    if (!label) {
      console.log(`${containerId}: No label found`);
      return;
    }

    const rect = label.getBoundingClientRect();
    const computed = window.getComputedStyle(label);

    console.log(`\n${containerId}:`, {
      rect: {
        top: rect.top,
        left: rect.left,
        height: rect.height,
        width: rect.width,
      },
      computed: {
        transform: computed.transform,
        transformOrigin: computed.transformOrigin,
        fontSize: computed.fontSize,
        lineHeight: computed.lineHeight,
        top: computed.top,
        left: computed.left,
      },
    });
  };

  const measureAll = () => {
    console.clear();
    console.log('=== MUI vs VE Label Metrics ===');
    
    // Empty state
    measureLabel('mui-empty');
    measureLabel('ve-empty');
    
    // Focused state
    measureLabel('mui-focused');
    measureLabel('ve-focused');
    
    // Filled state
    measureLabel('mui-filled');
    measureLabel('ve-filled');
    
    // Error state
    measureLabel('mui-error');
    measureLabel('ve-error');
    
    // Disabled state
    measureLabel('mui-disabled');
    measureLabel('ve-disabled');
  };

  const compareMetrics = () => {
    const states = ['empty', 'focused', 'filled', 'error', 'disabled'];
    const results: Array<{ state: string; muiTop: number; veTop: number; delta: number; pass: boolean }> = [];

    states.forEach(state => {
      const muiContainer = document.getElementById(`mui-${state}`);
      const veContainer = document.getElementById(`ve-${state}`);

      if (!muiContainer || !veContainer) return;

      const muiLabel = muiContainer.querySelector('label');
      const veLabel = veContainer.querySelector('label');

      if (!muiLabel || !veLabel) return;

      const muiRect = muiLabel.getBoundingClientRect();
      const veRect = veLabel.getBoundingClientRect();

      // Get container top to calculate relative position
      const muiContainerTop = muiContainer.getBoundingClientRect().top;
      const veContainerTop = veContainer.getBoundingClientRect().top;

      const muiRelativeTop = muiRect.top - muiContainerTop;
      const veRelativeTop = veRect.top - veContainerTop;

      const delta = Math.abs(muiRelativeTop - veRelativeTop);
      const pass = delta <= 1;

      results.push({
        state,
        muiTop: muiRelativeTop,
        veTop: veRelativeTop,
        delta,
        pass,
      });
    });

    console.table(results);

    const allPass = results.every(r => r.pass);
    console.log(`\n${allPass ? '✅ PASS' : '❌ FAIL'}: All deltas <= 1px: ${allPass}`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        TextField Diagnostic: MUI vs VE
      </Typography>
      
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button variant="contained" onClick={measureAll}>
          Measure All Labels (Console)
        </Button>
        <Button variant="contained" color="secondary" onClick={compareMetrics}>
          Compare Metrics (Console)
        </Button>
      </Stack>

      <Typography variant="h6" gutterBottom>
        Empty (no value, no focus)
      </Typography>
      <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
        <Box id="mui-empty" sx={{ width: 300 }}>
          <Typography variant="caption">MUI</Typography>
          <MuiTextField
            label="Label text"
            variant="outlined"
            fullWidth
            value={valueDefault}
            onChange={(e) => setValueDefault(e.target.value)}
          />
        </Box>
        <Box id="ve-empty" sx={{ width: 300 }}>
          <Typography variant="caption">VE</Typography>
          <TextFieldVE
            label="Label text"
            value={valueDefault}
            onChange={(e) => setValueDefault(e.target.value)}
          />
        </Box>
      </Stack>

      <Typography variant="h6" gutterBottom>
        Focused (empty but focused)
      </Typography>
      <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
        <Box id="mui-focused" sx={{ width: 300 }}>
          <Typography variant="caption">MUI</Typography>
          <MuiTextField
            label="Label text"
            variant="outlined"
            fullWidth
            value={valueFocused}
            onChange={(e) => setValueFocused(e.target.value)}
            autoFocus
          />
        </Box>
        <Box id="ve-focused" sx={{ width: 300 }}>
          <Typography variant="caption">VE</Typography>
          <TextFieldVE
            label="Label text"
            value={valueFocused}
            onChange={(e) => setValueFocused(e.target.value)}
            autoFocus
          />
        </Box>
      </Stack>

      <Typography variant="h6" gutterBottom>
        Filled (value present, no focus)
      </Typography>
      <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
        <Box id="mui-filled" sx={{ width: 300 }}>
          <Typography variant="caption">MUI</Typography>
          <MuiTextField
            label="Label text"
            variant="outlined"
            fullWidth
            value={valueFilled}
            onChange={(e) => setValueFilled(e.target.value)}
          />
        </Box>
        <Box id="ve-filled" sx={{ width: 300 }}>
          <Typography variant="caption">VE</Typography>
          <TextFieldVE
            label="Label text"
            value={valueFilled}
            onChange={(e) => setValueFilled(e.target.value)}
          />
        </Box>
      </Stack>

      <Typography variant="h6" gutterBottom>
        Error
      </Typography>
      <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
        <Box id="mui-error" sx={{ width: 300 }}>
          <Typography variant="caption">MUI</Typography>
          <MuiTextField
            label="Label text"
            variant="outlined"
            fullWidth
            value={valueError}
            onChange={(e) => setValueError(e.target.value)}
            error
            helperText="Error message"
          />
        </Box>
        <Box id="ve-error" sx={{ width: 300 }}>
          <Typography variant="caption">VE</Typography>
          <TextFieldVE
            label="Label text"
            value={valueError}
            onChange={(e) => setValueError(e.target.value)}
            errorText="Error message"
          />
        </Box>
      </Stack>

      <Typography variant="h6" gutterBottom>
        Disabled
      </Typography>
      <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
        <Box id="mui-disabled" sx={{ width: 300 }}>
          <Typography variant="caption">MUI</Typography>
          <MuiTextField
            label="Label text"
            variant="outlined"
            fullWidth
            value={valueDisabled}
            onChange={(e) => setValueDisabled(e.target.value)}
            disabled
          />
        </Box>
        <Box id="ve-disabled" sx={{ width: 300 }}>
          <Typography variant="caption">VE</Typography>
          <TextFieldVE
            label="Label text"
            value={valueDisabled}
            onChange={(e) => setValueDisabled(e.target.value)}
            disabled
          />
        </Box>
      </Stack>
    </Box>
  );
}
