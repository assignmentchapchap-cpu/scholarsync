import LibraryView from '@/components/library/LibraryView';
import { getAssets } from '@/app/actions/library';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
    const assets = await getAssets();
    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">My Library</h1>
                <p className="text-slate-500">Manage your documents, cartridges, and learning materials.</p>
            </div>
            <LibraryView initialAssets={assets} />
        </div>
    );
}
