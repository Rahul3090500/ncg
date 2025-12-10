/**
 * Example: Neon Server Action
 * 
 * This is an example of how to use Neon database with Next.js Server Actions.
 * You can use this pattern for forms and other server-side database operations.
 * 
 * To use this:
 * 1. Create a table in Neon SQL Editor:
 *    CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, comment TEXT, created_at TIMESTAMP DEFAULT NOW());
 * 
 * 2. Import and use in your component:
 *    import { createComment } from '@/app/examples/neon-server-action-example'
 * 
 * 3. Use in a form:
 *    <form action={createComment}>
 *      <input type="text" name="comment" />
 *      <button type="submit">Submit</button>
 *    </form>
 */

'use server'

import { getNeonConnection } from '@/lib/neon'

export async function createComment(formData: FormData) {
  try {
    const sql = getNeonConnection()
    const comment = formData.get('comment')

    if (!comment || typeof comment !== 'string') {
      return { success: false, error: 'Comment is required' }
    }

    // Insert the comment into the database
    await sql('INSERT INTO comments (comment) VALUES ($1)', [comment])

    return { success: true, message: 'Comment created successfully' }
  } catch (error: any) {
    console.error('Error creating comment:', error)
    return { success: false, error: error.message || 'Failed to create comment' }
  }
}

/**
 * Example: Fetch comments using Server Action
 */
export async function getComments() {
  try {
    const sql = getNeonConnection()
    const result = await sql('SELECT * FROM comments ORDER BY created_at DESC LIMIT 10')
    return { success: true, comments: result }
  } catch (error: any) {
    console.error('Error fetching comments:', error)
    return { success: false, error: error.message || 'Failed to fetch comments' }
  }
}
