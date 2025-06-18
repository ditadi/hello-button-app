
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { uiConfigTable } from '../db/schema';
import { getUIConfig } from '../handlers/get_ui_config';

describe('getUIConfig', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return default config when no configuration exists', async () => {
    const result = await getUIConfig();

    expect(result.buttonText).toEqual('hello');
    expect(result.buttonColor).toEqual('red');
    expect(result.buttonAction).toBeNull();
  });

  it('should return configuration from database', async () => {
    // Insert test configuration
    await db.insert(uiConfigTable)
      .values({
        button_text: 'Click Me',
        button_color: 'blue',
        button_action: 'submit'
      })
      .execute();

    const result = await getUIConfig();

    expect(result.buttonText).toEqual('Click Me');
    expect(result.buttonColor).toEqual('blue');
    expect(result.buttonAction).toEqual('submit');
  });

  it('should return most recent configuration when multiple exist', async () => {
    // Insert first configuration
    await db.insert(uiConfigTable)
      .values({
        button_text: 'Old Button',
        button_color: 'green',
        button_action: 'old_action'
      })
      .execute();

    // Insert second configuration (more recent)
    await db.insert(uiConfigTable)
      .values({
        button_text: 'New Button',
        button_color: 'purple',
        button_action: null
      })
      .execute();

    const result = await getUIConfig();

    expect(result.buttonText).toEqual('New Button');
    expect(result.buttonColor).toEqual('purple');
    expect(result.buttonAction).toBeNull();
  });

  it('should handle null button_action correctly', async () => {
    // Insert configuration with null action
    await db.insert(uiConfigTable)
      .values({
        button_text: 'No Action Button',
        button_color: 'gray',
        button_action: null
      })
      .execute();

    const result = await getUIConfig();

    expect(result.buttonText).toEqual('No Action Button');
    expect(result.buttonColor).toEqual('gray');
    expect(result.buttonAction).toBeNull();
  });
});
