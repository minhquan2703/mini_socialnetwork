import ChatBox from "@/components/messages/chat.box";

const MessagePage = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;

    return (
        <>
            <ChatBox roomId={id} />
        </>
    );
};

export default MessagePage;
