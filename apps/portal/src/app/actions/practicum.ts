'use server';

import { createSessionClient } from "@schologic/database/server"; // Import from specific server entry point if possible, or index
import { cookies } from "next/headers";

// Note: If @schologic/database index exports * from server, I can import { createSessionClient } from "@schologic/database"
// However, the previous tool output showed index exporting everything.
// Let's assume named export is available from the package root.

export async function updatePracticumRubric(
    practicumId: string,
    rubricType: 'logs' | 'supervisor' | 'report',
    rubricData: any
) {
    try {
        const cookieStore = await cookies();
        const supabase = createSessionClient(cookieStore);

        // 1. Verify User
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error("Auth Error:", authError);
            throw new Error('Unauthorized');
        }

        // 2. Map type to column
        const columnMap = {
            'logs': 'logs_rubric',
            'supervisor': 'supervisor_report_template',
            'report': 'student_report_template'
        };

        const column = columnMap[rubricType];
        if (!column) throw new Error('Invalid rubric type');

        // 3. Update Database
        const { error } = await supabase
            .from('practicums')
            .update({ [column]: rubricData })
            .eq('id', practicumId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('Error updating rubric:', error);
        return { success: false, error: error.message };
    }
}
