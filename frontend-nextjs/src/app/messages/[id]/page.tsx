import ChatBox from "@/components/messages/chat.box";
interface IProps {
    params: Promise<{ id: string }>;
}
const MessagePage = async ({ params }: IProps) => {
    const { id } = await params;

    return (
        <>
            <ChatBox roomId={id} />
        </>
    );
};

export default MessagePage;
