
import { db } from '../db';
import { uiConfigTable } from '../db/schema';
import { type UIConfig } from '../schema';
import { desc } from 'drizzle-orm';

export async function getUIConfig(): Promise<UIConfig> {
  try {
    // Get the most recent UI configuration
    const result = await db.select()
      .from(uiConfigTable)
      .orderBy(desc(uiConfigTable.created_at))
      .limit(1)
      .execute();

    // If no configuration exists, return default
    if (result.length === 0) {
      return {
        buttonText: 'hello',
        buttonColor: 'red',
        buttonAction: null
      };
    }

    // Return the configuration from database
    const config = result[0];
    return {
      buttonText: config.button_text,
      buttonColor: config.button_color,
      buttonAction: config.button_action
    };
  } catch (error) {
    console.error('Failed to get UI config:', error);
    throw error;
  }
}
