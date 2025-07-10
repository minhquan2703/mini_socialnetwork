import ChatBox from "@/components/messages/chat.box";

const MessagePage = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;
    // roomId có thể từ URL params hoặc được chọn từ danh sách rooms

    return (
        <>
            <ChatBox roomId={id} />
        </>
    );
};

export default MessagePage;
