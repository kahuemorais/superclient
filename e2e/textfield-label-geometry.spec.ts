import { test, expect } from '@playwright/test';

/**
 * E2E test comparing TextField VE label geometry with MUI TextField
 * 
 * Validates that VE label positioning matches MUI within 1px tolerance
 * for all states: empty, focused, filled, error, disabled
 */

test.describe('TextField VE Label Geometry', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/textfield-diagnostic');
    await page.waitForLoadState('networkidle');
  });

  const measureLabel = async (page: any, containerId: string) => {
    const container = page.locator(`#${containerId}`);
    const label = container.locator('label').first();

    const containerBox = await container.boundingBox();
    const labelBox = await label.boundingBox();

    if (!containerBox || !labelBox) {
      throw new Error(`Could not measure ${containerId}`);
    }

    // Calculate relative position from container
    const relativeTop = labelBox.y - containerBox.y;
    const relativeLeft = labelBox.x - containerBox.x;

    const computed = await label.evaluate((el: HTMLElement) => {
      const style = window.getComputedStyle(el);
      return {
        transform: style.transform,
        transformOrigin: style.transformOrigin,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        top: style.top,
        left: style.left,
      };
    });

    return {
      box: {
        top: relativeTop,
        left: relativeLeft,
        height: labelBox.height,
        width: labelBox.width,
      },
      computed,
    };
  };

  const compareState = async (page: any, state: string, tolerance = 1) => {
    const muiMetrics = await measureLabel(page, `mui-${state}`);
    const veMetrics = await measureLabel(page, `ve-${state}`);

    const deltaTop = Math.abs(muiMetrics.box.top - veMetrics.box.top);
    const deltaLeft = Math.abs(muiMetrics.box.left - veMetrics.box.left);
    const deltaHeight = Math.abs(muiMetrics.box.height - veMetrics.box.height);

    return {
      state,
      mui: muiMetrics,
      ve: veMetrics,
      deltas: {
        top: deltaTop,
        left: deltaLeft,
        height: deltaHeight,
      },
      pass: deltaTop <= tolerance && deltaLeft <= tolerance && deltaHeight <= tolerance,
    };
  };

  test('empty state: VE label matches MUI within 1px', async ({ page }) => {
    const result = await compareState(page, 'empty');

    console.log(`Empty state comparison:`, {
      muiTop: result.mui.box.top,
      veTop: result.ve.box.top,
      deltaTop: result.deltas.top,
      muiTransform: result.mui.computed.transform,
      veTransform: result.ve.computed.transform,
    });

    expect(result.deltas.top).toBeLessThanOrEqual(1);
    expect(result.deltas.left).toBeLessThanOrEqual(1);
    expect(result.deltas.height).toBeLessThanOrEqual(1);
  });

  test('focused state: VE label matches MUI within 1px', async ({ page }) => {
    const result = await compareState(page, 'focused');

    console.log(`Focused state comparison:`, {
      muiTop: result.mui.box.top,
      veTop: result.ve.box.top,
      deltaTop: result.deltas.top,
      muiTransform: result.mui.computed.transform,
      veTransform: result.ve.computed.transform,
    });

    expect(result.deltas.top).toBeLessThanOrEqual(1);
    expect(result.deltas.left).toBeLessThanOrEqual(1);
    expect(result.deltas.height).toBeLessThanOrEqual(1);
  });

  test('filled state: VE label matches MUI within 1px', async ({ page }) => {
    const result = await compareState(page, 'filled');

    console.log(`Filled state comparison:`, {
      muiTop: result.mui.box.top,
      veTop: result.ve.box.top,
      deltaTop: result.deltas.top,
      muiTransform: result.mui.computed.transform,
      veTransform: result.ve.computed.transform,
    });

    expect(result.deltas.top).toBeLessThanOrEqual(1);
    expect(result.deltas.left).toBeLessThanOrEqual(1);
    expect(result.deltas.height).toBeLessThanOrEqual(1);
  });

  test('error state: VE label matches MUI within 1px', async ({ page }) => {
    const result = await compareState(page, 'error');

    console.log(`Error state comparison:`, {
      muiTop: result.mui.box.top,
      veTop: result.ve.box.top,
      deltaTop: result.deltas.top,
      muiTransform: result.mui.computed.transform,
      veTransform: result.ve.computed.transform,
    });

    expect(result.deltas.top).toBeLessThanOrEqual(1);
    expect(result.deltas.left).toBeLessThanOrEqual(1);
    expect(result.deltas.height).toBeLessThanOrEqual(1);
  });

  test('disabled state: VE label matches MUI within 1px', async ({ page }) => {
    const result = await compareState(page, 'disabled');

    console.log(`Disabled state comparison:`, {
      muiTop: result.mui.box.top,
      veTop: result.ve.box.top,
      deltaTop: result.deltas.top,
      muiTransform: result.mui.computed.transform,
      veTransform: result.ve.computed.transform,
    });

    expect(result.deltas.top).toBeLessThanOrEqual(1);
    expect(result.deltas.left).toBeLessThanOrEqual(1);
    expect(result.deltas.height).toBeLessThanOrEqual(1);
  });

  test('all states pass within tolerance', async ({ page }) => {
    const states = ['empty', 'focused', 'filled', 'error', 'disabled'];
    const results = await Promise.all(
      states.map(state => compareState(page, state))
    );

    const summary = results.map(r => ({
      state: r.state,
      muiTop: r.mui.box.top.toFixed(2),
      veTop: r.ve.box.top.toFixed(2),
      deltaTop: r.deltas.top.toFixed(2),
      pass: r.pass ? '✅' : '❌',
    }));

    console.table(summary);

    const allPass = results.every(r => r.pass);
    expect(allPass).toBe(true);
  });
});
