import DashboardLayout from '@/components/layout/DashboardLayout';
import ChatWidget from '@/components/chat/ChatWidget';

export default function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardLayout role="instructor">
            {children}
            <ChatWidget />
        </DashboardLayout>
    );
}
